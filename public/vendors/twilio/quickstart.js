$(function () {
    let token, identity, twilio_caller_id, twilio_location, device;
    let callStartTime = 0;
    let timeCounterCounting = false;

    let accessTokenUrl = "http://127.0.0.1:8000/api/get-twilio-access-token";
    startupClient();
    async function startupClient() {
        let self = this;
        try {
            await makeAjaxPost({}, accessTokenUrl).done(res => {
                token = res.data.twilio_access_token;
                identity = res.data.twilio_identity;
                twilio_caller_id = res.data.twilio_caller_id;
                twilio_location = res.data.twilio_location;
            });
            device = new Twilio.Device(token, {
                logLevel: 1,
                // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
                // providing better audio quality in restrained network conditions.
                codecPreferences: ["opus", "pcmu"],
                maxCallSignalingTimeoutMs: 30000,
            });
            $('.dial-to-phone').show();
            registerPhoneEventListener();
            device.register();
        } catch (err) {
            console.log(err);
        }
    }
    function registerPhoneEventListener() {
        $('.dial-to-phone').on('click', async function () {
            isAnyTaskInProgress = true;
            let dialing_number = $(this).data('phone');
            if (device) {
                let params = {
                    To: dialing_number,
                    agent: identity, // Optional
                    callerId: twilio_caller_id, // Optional
                    Location: twilio_location // Optional
                };
                let connection = await device.connect({params: params});

                callStarted(connection);
                connection.on('statusChange', function (status) {
                    console.log('Call status changed to:', status);
                });
                // Call Hang up  -- X >>
                $('.hang-call').on('click', function () {
                    callDisconnectOperation(connection);
                });
                // Call Mute  -- M1 >>
                $('.mute-call').on('click', function () {
                    callMuteOperation(connection, true);
                });
                $('.unmute-call').on('click', function () {
                    callMuteOperation(connection, false);
                });
                connection.on('disconnect', callDisconnectOperation)
            }
        });

        device.on('incoming', handleIncomingCall);
    }
    /***********************/
    function callStarted(connection){
        $('.loading_dot').show();
        $('.dial-to-phone').hide();
        bindVolumeIndicators(connection)
        setTimeout(() => {
            timeCounterCounting = true;
            timeCounterLoop();
            $('.call-activated').addClass('d-flex').removeClass('d-none');
            $('.mute-call').show();
            $('.hang-call').show();
            $('.loading_dot').hide();
        },5000);
    }
    function bindVolumeIndicators(connection) {
        let inputVolumeBar = document.getElementById('input-volume')
        let outputVolumeBar = document.getElementById('output-volume')
        connection.on('volume', function(inputVolume, outputVolume) {
            let inputColor, outputColor;
            if (inputVolume < .20) {inputColor = '#4B21EE55';}else if (inputVolume < .30) {inputColor = '#4B21EE77';}else if (inputVolume < .40) {inputColor = '#4B21EE99';}else if (inputVolume < .50) {inputColor = '#4B21EEAA';}else if (inputVolume < .70) {inputColor = '#4B21EECC';}else if (inputVolume < .80) {inputColor = '#4B21EEEE';}else{inputColor = '#EA4335';}
            inputVolumeBar.style.width = Math.floor(inputVolume * 100) + 'px';
            inputVolumeBar.style.background = inputColor;
            if (outputVolume < .20) {outputColor = '#4B21EE55';}else if (outputVolume < .30) {outputColor = '#4B21EE77';}else if (outputVolume < .40) {outputColor = '#4B21EE99';}else if (outputVolume < .50) {outputColor = '#4B21EEAA';}else if (outputVolume < .70) {outputColor = '#4B21EECC';}else if (outputVolume < .80) {outputColor = '#4B21EEEE';}else{outputColor = '#EA4335';}
            outputVolumeBar.style.width = Math.floor(outputVolume * 100) + 'px';
            outputVolumeBar.style.background = outputColor;
        });
    }
    /***********************/
    function callDisconnectOperation(connection) {
        connection.disconnect();
        callStartTime = 0;
        timeCounterCounting = false;
        $('.call-activated').removeClass('d-flex').addClass('d-none');
        $('.dial-to-phone').show();
        $('.hang-call').hide();
        isAnyTaskInProgress = false;
        //
    }
    /***********************/
    function callMuteOperation(connection, mute = true) {
        connection.mute(mute);
        if(mute){
            $('.mute-call').hide();
            $('.unmute-call').show();
        }else{
            $('.mute-call').show();
            $('.unmute-call').hide();
        }
    }
    /***********************/
    function timeCounterLoop(){
        if(timeCounterCounting){
            setTimeout(function(){
                let hour = '00';
                let minutes = Math.floor(callStartTime/60.0);
                let seconds = callStartTime%60;
                if(minutes < 10){ minutes = '0' + minutes; }
                if(seconds < 10){  seconds = '0' + seconds; }
                $('.call-timer').text(hour + ':' + minutes + ':' + seconds);
                callStartTime += 1;
                timeCounterLoop();
            }, 1000);
        }
    }
    /***********************/
    /***********************/
    function handleIncomingCall(connection) {
        console.log('Incoming Call from ' + connection.parameters.From);
        // Incoming call accept -- Y <<
        $('#accept-call').on('click', function () {
            callAcceptOperation(connection);
        });
        // Incoming call reject -- N <<
        $('#reject-call').on('click', function () {
            callRejectOperation(connection);
        });
        // Call Hang up  -- X <<
        $('#hang-call').on('click', function () {
            callDisconnectOperation(connection);
        });
    }
    function callAcceptOperation(connection) {
        connection.accept();
        //
    }
    function callRejectOperation(connection) {
        connection.reject();
        //
    }
});