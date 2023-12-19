const leadToolTip = tippy('.leadToolTip', {
    theme: 'outreachbin',
    followCursor: false,
    arrow: true,
    placement: 'right',
    interactive: false
});
// plus icon click function
$('.filter-heading').on('click', function () {
    $('.plus-icon').html(`<svg width="15" height="14" viewBox="0 0 15 14" fill="none"> <path d="M14.5 8H8.5V14H6.5V8H0.5V6H6.5V0H8.5V6H14.5V8Z" fill="#707070"/> </svg>`);
    if ($('#leftSidebar').hasClass('collapsed')) {
        $('li.pos').each((i, el) => {
            let $title = $(el).data('val');
        })
    }
    if ($(this).parent('li').find('.sidebar-list-popup').is(':visible')) {
        for (let i = 0; i < leadToolTip.length; i++) {
            leadToolTip[i].enable();
        }
        $('.sidebar-list-popup').addClass('active');
        $('.sidebar-list-popup').fadeOut(300);
    } else {
        setTimeout(() => {
            for (let i = 0; i < leadToolTip.length; i++) {
                leadToolTip[i].disable();
            }
            $(this).find('.plus-icon').html(`<svg width="15" height="3" viewBox="0 0 15 3" fill="none"><path d="M0.359131 1.5H14.9481" stroke="#3F39F3" stroke-width="3"/></svg>`);
            $(this).parent('li').find('.sidebar-list-popup').fadeIn(300);
            let offs = $(this).parent('li').find('.sidebar-list-popup');
            let bottomPosisiton = $(window).height() - (offs.offset().top + offs.get(0).getBoundingClientRect().height);
            if (bottomPosisiton < 0) {
                $('.sidebar-list-popup').removeClass('bottom-top');
                $(this).parent('li').find('.sidebar-list-popup').addClass('bottom-top');
            }
        }, 100)
    }
    $('.sidebar-list-popup').hide();
    $('.sidebar-list-popup .active').show();
});
$('.search').keyup(function () {
    var matches = $('ul.select-list').find('li:contains(' + $(this).val() + ') ');
    $('li', 'ul.select-list').not(matches).slideUp();
    matches.slideDown();
});

// dropdown js
$('.header-profile-info').on('click', function () {
    $('.pro-dropdown-potion').slideToggle(200);
});

/* email dropdown button js */
$('.more button').on('click', function () {
    $(this).parent().find('.email-action-dropdown').slideDown(300);
});

// sidebar toggle js
$(document).on('click', '.collapse-icon', function () {
    for (let i = 0; i < leadToolTip.length; i++) {
        leadToolTip[i].enable();
    }
    $('.need-tooltip').addClass('leadToolTip');
    $('#leftSidebar').addClass('collapsed');
    $('.search-leads-wrap').addClass('collapsed-container');
});

$(document).on('click', '.collapse-visible-icon', function () {
    for (let i = 0; i < leadToolTip.length; i++) {
        leadToolTip[i].disable();
    }
    $('#leftSidebar').removeClass('collapsed');
    $('.search-leads-wrap').removeClass('collapsed-container');
    const instance = tippy(document.querySelector('.leadToolTip'));
    instance.disable();

});

// total filter popup js
$('.total-filter > p').on('click', function () {
    $('.total-filter-popup').slideDown(300);
});

// total filter popup js
$('.popup-close-btn').on('click', function () {
    $('.total-filter-popup').slideUp(300);
});
// });

const leadsObj = {
    jobRole: [],
    contacts: [],
    contactsLoading: true,
    leadsCredits: $credits,
    formData: {
        total: 0,
        page: 1,
        perPage: 20,
        markPoint: '',
        myContacts: 0,
        title: [],
        title_ex: [],
        title_role: [],
        gender: [],
        city: [],
        state: [],
        state_ex: [],
        country: [],
        keywords: [],
        keywords_ex: [],
        company_name: [],
        company_name_ex: [],
        industry: [],
        industry_ex: [],
        company_keywords: [],
        company_keywords_ex: [],
        technologies: [],
        domain: [],
        inferred_salary: {
            min: 30000,
            max: 200000,
            search: false
        },
        linkedin_connections: {
            min: 1,
            max: 5000,
            search: false
        },
        inferred_years_experience: {
            min: 2,
            max: 5,
            search: false
        },
        employee_count: {
            min: 1,
            max: 1000,
            search: false
        },
        birth_year: {
            min: 1995,
            max: 2005,
            search: false
        },
        // birth_year: '',
        searchName: '',
        isOnlyPhone: false,
        isOnlyEmail: true,
        sortIndex: '',
        sortOrder: '',
    },
    showFilterArea: false,
    searchFields: {},
    hidePopup: true,
    totalRecords: 0,
    historypush: true,
    markPoints: [],
    isAllChecked: false,
    listLoading: true,
    addingToList: false,
    addingList: false,
    listName: '',
    listId: '',
    selectedLeads: [],
    selectedLeadsForUnlock: [],
    saveLeads: [],
    checkAll: false,
    leadsSearchInit() {
        let self = this;
        this.$watch('checkAll', (value) => {
            self.unselectedAll();
            if (value) {
                for (i in self.contacts) {
                    self.selectedLeadsIndex.push(parseInt(i));
                    self.selectedLeads.push(self.contacts[i]._id);
                    self.selectedLeadsForUnlock.push(self.contacts[i]._id);
                }
                $(".row-select").prop("checked", true);
            }
        });

        $('.select2').select2({
            tags: true,
            createTag: function (params) {
                return {
                    id: params.term,
                    text: params.term,
                    newOption: true,
                    allowClear: false
                }
            }
        });

        $('.select2').change(function () {
            var fieldName = $(this).attr('id');
            if (fieldName) {
                if ($(this).val() !== null) {
                    // if (fieldName === 'industry' || fieldName === 'industry_ex') {
                    //     self.formData[fieldName] = [$(this).val()];
                    //     self.searchFields[fieldName] = [$(this).val()];
                    // } else {
                    self.formData[fieldName] = $(this).val();
                    self.searchFields[fieldName] = $(this).val();
                    // }
                    var conatinerFieldName = fieldName;
                    conatinerFieldName = conatinerFieldName.replace('_ex', '');

                    if ($('#ex_' + conatinerFieldName).is(':checked')) {
                        if (Reflect.has(self.searchFields, conatinerFieldName)) {
                            delete self.searchFields[conatinerFieldName];
                        }
                        // self.searchFields[conatinerFieldName+'_ex'] = fieldValue;
                    } else {
                        if (Reflect.has(self.searchFields, conatinerFieldName + '_ex')) {
                            delete self.searchFields[conatinerFieldName + '_ex'];
                        }
                        // self.searchFields[conatinerFieldName] = fieldValue;
                    }
                }
            }
        });

        $('.excludeCheckbox').change(function () {
            var inputName = $(this).attr('data-val');
            if ($(this).is(':checked')) {
                self.formData[inputName] = [];
                $(this).parent('label').parent('.filters_contents_contents').find('select').attr('id', inputName + '_ex');
            } else {
                self.formData[inputName + '_ex'] = [];
                $(this).parent('label').parent('.filters_contents_contents').find('select').attr('id', inputName);
            }
            setTimeout(() => {
                $(this).parent('label').parent('.filters_contents_contents').find('.form-control.select2').trigger('change');
            }, 100)
        });

        this.sliderInit();

        if (this.formData.markPoint != '') {
            this.searchLeads();
        }
        this.searchLeads();
        this.loadSaveSearch();
    },
    sliderInit(){
        let self = this;
        $("#inferred_salary").slider({
            range: true,
            min: 10000,
            max: 250000,
            values: [self.formData.inferred_salary.min, self.formData.inferred_salary.max],
            slide: function (event, ui) {
                self.sliderField(event, ui, 'inferred_salary');
            },
            create: function (event, ui) {
                self.sliderCreate(event, 'inferred_salary')
            },
            change: function (event, ui) {
                self.sliderField(event, ui, 'inferred_salary');
            }
        });

        $("#linkedin_connections").slider({
            range: true,
            min: 1,
            max: 50000,
            values: [self.formData.linkedin_connections.min, self.formData.linkedin_connections.max],
            slide: function (event, ui) {
                self.sliderField(event, ui, 'linkedin_connections');
            },
            create: function (event, ui) {
                self.sliderCreate(event, 'linkedin_connections')
            },
            change: function (event, ui) {
                self.sliderField(event, ui, 'linkedin_connections');
            }
        });

        $("#inferred_years_experience").slider({
            range: true,
            min: 0,
            max: 50,
            values: [self.formData.inferred_years_experience.min, self.formData.inferred_years_experience.max],
            slide: function (event, ui) {
                self.sliderField(event, ui, 'inferred_years_experience');
            },
            create: function (event, ui) {
                self.sliderCreate(event, 'inferred_years_experience')
            },
            change: function (event, ui) {
                self.sliderField(event, ui, 'inferred_years_experience');
            }
        });

        $("#employee_count").slider({
            range: true,
            min: 0,
            max: 5000,
            values: [self.formData.employee_count.min, self.formData.employee_count.max],
            slide: function (event, ui) {
                self.sliderField(event, ui, 'employee_count');
            },
            create: function (event, ui) {
                self.sliderCreate(event, 'employee_count')
            },
            change: function (event, ui) {
                self.sliderField(event, ui, 'employee_count');
            }
        });

        $("#birth_year").slider({
            range: true,
            min: 1970,
            max: 2010,
            values: [self.formData.birth_year.min, self.formData.birth_year.max],
            slide: function (event, ui) {
                self.sliderField(event, ui, 'birth_year');
            },
            create: function (event, ui) {
                self.sliderCreate(event, 'birth_year')
            },
            change: function (event, ui) {
                self.sliderField(event, ui, 'birth_year');
            }
        });
    },

    sliderField(event, ui, key) {
        $(event.target).find('.ui-slider-handle:first').html('<div class="tooltip bs-tooltip-bottom slider-tip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + ui.values[0] + '</div></div>');
        $(event.target).find('.ui-slider-handle:last').html('<div class="tooltip bs-tooltip-bottom slider-tip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + ui.values[1] + '</div></div>');
        this.formData[key].min = ui.values[0];
        this.formData[key].max = ui.values[1];
        this.searchFields[key] = [ui.values[0] + ' - ' + ui.values[1]];
        this.formData[key].search = true;
    },
    sliderCreate(event, key) {
        $(event.target).find('.ui-slider-handle:first').html('<div class="tooltip bs-tooltip-bottom slider-tip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + this.formData[key].min + '</div></div>');
        $(event.target).find('.ui-slider-handle:last').html('<div class="tooltip last-element bs-tooltip-bottom slider-tip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + this.formData[key].max + '</div></div>');
    },
    deleteSearch(index, parentI) {
        let self = this;
        this.hidePopup = false;
        if(Object.prototype.toString.call(this.formData[parentI]) === '[object Object]') {
            switch (parentI) {
                case 'inferred_salary':
                    self.formData.inferred_salary = {min: 30000, max: 200000, search: false};
                    $("#inferred_salary").slider({
                        range: true,
                        min: 10000,
                        max: 250000,
                        values: [self.formData.inferred_salary.min, self.formData.inferred_salary.max],
                        slide: function (event, ui) {
                            self.sliderField(event, ui, 'inferred_salary');
                        },
                        create: function (event, ui) {
                            self.sliderCreate(event, 'inferred_salary')
                        },
                        change: function (event, ui) {
                            self.sliderField(event, ui, 'inferred_salary');
                        }
                    });
                    break;
                case 'linkedin_connections':
                    self.formData.linkedin_connections = {min: 1, max: 5000, search: false};
                    $("#linkedin_connections").slider({
                        range: true,
                        min: 1,
                        max: 50000,
                        values: [self.formData.linkedin_connections.min, self.formData.linkedin_connections.max],
                        slide: function (event, ui) {
                            self.sliderField(event, ui, 'linkedin_connections');
                        },
                        create: function (event, ui) {
                            self.sliderCreate(event, 'linkedin_connections')
                        },
                        change: function (event, ui) {
                            self.sliderField(event, ui, 'linkedin_connections');
                        }
                    });
                    break;
                case 'inferred_years_experience':
                    self.formData.inferred_years_experience = {min: 2, max: 5, search: false};
                    $("#inferred_years_experience").slider({
                        range: true,
                        min: 0,
                        max: 50,
                        values: [self.formData.inferred_years_experience.min, self.formData.inferred_years_experience.max],
                        slide: function (event, ui) {
                            self.sliderField(event, ui, 'inferred_years_experience');
                        },
                        create: function (event, ui) {
                            self.sliderCreate(event, 'inferred_years_experience')
                        },
                        change: function (event, ui) {
                            self.sliderField(event, ui, 'inferred_years_experience');
                        }
                    });
                    break;
                case 'employee_count':
                    self.formData.employee_count = {min: 1, max: 1000, search: false};
                    $("#employee_count").slider({
                        range: true,
                        min: 0,
                        max: 5000,
                        values: [self.formData.employee_count.min, self.formData.employee_count.max],
                        slide: function (event, ui) {
                            self.sliderField(event, ui, 'employee_count');
                        },
                        create: function (event, ui) {
                            self.sliderCreate(event, 'employee_count')
                        },
                        change: function (event, ui) {
                            self.sliderField(event, ui, 'employee_count');
                        }
                    });
                    break;
                default: //birth_year
                    self.formData.birth_year = {min: 1995, max: 2005, search: false};
                    $("#birth_year").slider({
                        range: true,
                        min: 1970,
                        max: 2010,
                        values: [self.formData.birth_year.min, self.formData.birth_year.max],
                        slide: function (event, ui) {
                            self.sliderField(event, ui, 'birth_year');
                        },
                        create: function (event, ui) {
                            self.sliderCreate(event, 'birth_year')
                        },
                        change: function (event, ui) {
                            self.sliderField(event, ui, 'birth_year');
                        }
                    });
                    break;
            }
            delete self.searchFields[parentI];
        }else{
            self.formData[parentI].splice(index, 1);
            self.searchFields[parentI].splice(index, 1);
            let currentValues = self.searchFields[parentI];
            if (self.searchFields[parentI].length === 0) {
                delete self.searchFields[parentI];
                currentValues = '';
                self.formData[parentI] = [];

            }
            $('#' + parentI).val(currentValues).trigger('change');
        }
        setTimeout(() => {
            self.hidePopup = true;
        }, 200)
    },
    clearSearch(reload = true) {
        $('.plus-icon').html(`<svg width="15" height="14" viewBox="0 0 15 14" fill="none"> <path d="M14.5 8H8.5V14H6.5V8H0.5V6H6.5V0H8.5V6H14.5V8Z" fill="#707070"/> </svg>`);
        for (var variableKey in this.searchFields) {
            $('#' + variableKey).val('').trigger('change');
        }
        this.searchFields = {};
        this.formData.myContacts = 0;
        this.formData.title = [];
        this.formData.title_ex = [];
        this.formData.title_role = [];
        this.formData.gender = [];
        this.formData.city = [];
        this.formData.state = [];
        this.formData.state_ex = [];
        this.formData.country = [];
        this.formData.keywords = [];
        this.formData.keywords_ex = [];
        this.formData.company_name = [];
        this.formData.company_name_ex = [];
        this.formData.industry = [];
        this.formData.industry_ex = [];
        this.formData.company_keywords = [];
        this.formData.company_keywords_ex = [];
        this.formData.technologies = [];
        this.formData.domain = [];
        this.formData.inferred_salary = {min: 30000, max: 200000, search: false};
        this.formData.linkedin_connections = {min: 1, max: 5000, search: false};
        this.formData.inferred_years_experience = {min: 2, max: 5, search: false};
        this.formData.employee_count = {min: 1, max: 1000, search: false};
        this.formData.birth_year = {min: 1995, max: 2005, search: false};
        this.formData.searchName = '';
        this.formData.isOnlyPhone = false;
        this.formData.isOnlyEmail = true;
        this.sliderInit();
        this.searchFields = {};
        if(reload){
            this.searchLeads();
        }
    },
    clickClose(){
        $('.sidebar-list-popup').fadeOut(300);
        $('.plus-icon').html(`<svg width="15" height="14" viewBox="0 0 15 14" fill="none"> <path d="M14.5 8H8.5V14H6.5V8H0.5V6H6.5V0H8.5V6H14.5V8Z" fill="#707070"/> </svg>`);
    },
    individualSearchCount(id) {
        if (Reflect.has(this.searchFields, id)) {
            return this.searchFields[id].length;
        }
        if (Reflect.has(this.searchFields, id + '_ex')) {
            return this.searchFields[id + '_ex'].length;
        }
        return 0;
    },

    hideFilterHeading() {
        if (this.hidePopup) {
            $('.sidebar-list-popup').fadeOut(300);
        }
    },
    toggleMyContacts($el){
        this.formData.myContacts = 0;
        if($el.checked){
            this.formData.myContacts = 1;
        }
        this.searchLeads();
    },
    searchLeads(myContact = 0) {
        let self = this;
        this.clickClose();
        this.totalRecords = 0;
        // this.showNotFound = false;
        // this.isAllChecked = false;
        // this.submitBtnDiabled = true;
        // this.showLoading = true;
        // this.formData.selectedLeads = null;
        // this.formData.initSearch = 0;
        // console.log(this.formData);
        // self.formData.myContacts = myContact;
        self.contactsLoading = true;
        self.contacts = [];
        // selectedColumns
        for(i in this.searchFields){
            console.log(i);
            if(!this.selectedColumns.includes(i)){
                this.selectedColumns.push(i);
            }
        }
        makeAjaxPost(this.formData, $url + '/leads/search').done(res => {
            if (res.success) {
                if (res.data.length > 0) {
                    self.contacts = res.data // self.historypush = false;
                    self.totalRecords = res.meta.total
                    if (res.meta !== undefined) {
                        if (self.historypush) {
                            self.markPoints.push(res.meta.newMarkPoint);
                            let params = new URLSearchParams({
                                pages: self.markPoints,
                                perPage: res.meta.perPage,
                                page: res.meta.page
                            }).toString();
                            // window.history.pushState({}, null, $url + '/leads/search?' + params);
                        } else {
                            // self.historypush = true;
                        }
                        self.formData.page = res.meta.page;
                        self.formData.perPage = res.meta.perPage;
                        self.formData.total = res.meta.total;
                        self.formData.markPoint = '';
                    }
                }
                self.unselectedAll();
            } else {
                swalError(res.msg, 'Leads Search!');
            }
            self.contactsLoading = false;
        })
    },

    prePage() {
        if (this.formData.page > 1) {
            this.formData.page = parseInt(this.formData.page) - 1
            this.markPoints.splice(-2, 2);
            this.formData.markPoint = this.markPoints[this.markPoints.length - 1];
            this.searchLeads(this.formData.myContacts);
        }
    },

    nextPage() {
        let $last = Math.ceil(parseInt(this.formData.total) / parseInt(this.formData.perPage));
        if (parseInt(this.formData.page) < $last) {
            this.formData.page = parseInt(this.formData.page) + 1;
            this.formData.markPoint = this.markPoints[this.markPoints.length - 1];
            this.searchLeads(this.formData.myContacts);
        } else {
            swalError("No more Data remaining");
        }
    },
    setPerpage(qty) {
        this.formData.page = 1;
        this.formData.perPage = qty;
        this.markPoints = [];
        this.searchLeads(this.formData.myContacts);
    },

    isRequestShow(phone) {
        if (phone) {
            return false;
        } else {
            return true;
        }
    },
    unLockEmailPhone(rowId, type, place, rowIds = []) {
        let self = this;
        $('.unlock_loading_btn_' + rowId).addClass('unlock_loading_btn');
        if (type === 'all') {
            rowIds.forEach(element => {
                $('.unlock_loading_btn_' + element).addClass('unlock_loading_btn');
            });
        }
        setTimeout(() => {
            makeAjaxPost({
                type: type,
                rowId: rowId,
                rowIds: rowIds.join(','),
            }, $url + '/leads/unlock-email-phone', 'unlock_loading_btn').done(res => {
                if (res.success) {
                    self.leadsCredits = res.data.credits;
                    for (index in this.contacts) {
                        var getN = this.contacts[index];
                        if (res.data.datas[getN._source.rowId + '_email']) {
                            getN._source.email = res.data.datas[getN._source.rowId + '_email'];
                            if (place == 'pop') {
                                this.contactData = getN._source;
                            }
                        }
                        if (res.data.datas[getN._source.rowId + '_phone']) {
                            getN._source.mobile_phone = res.data.datas[getN._source.rowId + '_phone'];
                            if (place == 'pop') {
                                this.contactData = getN._source;
                            }
                        }
                    }
                } else {
                    swalRedirect($url + '/billing?activeTab=leads-plan-tab', res.msg, 'danger', 'Upgrade Now!', 'Insuffient Leads Credits!');
                }
                $('.btn.lock').removeClass('unlock_loading_btn');
            });
        }, 100);
    },

    selectedLeadsIndex: [],
    singleSelect(event, getN, i) {
        if (event.shiftKey) {
            let lastIndex = this.selectedLeadsIndex[this.selectedLeadsIndex.length - 1];
            let large = Math.max(i,lastIndex);
            let small = Math.min(i,lastIndex);
            if (event.target.checked) {
                for(x=small;x<=large;x++){
                    if (!this.selectedLeads.includes(this.contacts[x]._id)) {
                        this.selectedLeadsIndex.push(x);
                        this.selectedLeads.push(this.contacts[x]._id);
                        this.selectedLeadsForUnlock.push(this.contacts[x]._id);
                    }
                }
            }else{
                for(x=small;x<=large;x++){
                    this.selectedLeadsIndex = arrayRemove(this.selectedLeadsIndex, x);
                    this.selectedLeads = arrayRemove(this.selectedLeads, this.contacts[x]._id);
                    this.selectedLeadsForUnlock = arrayRemove(this.selectedLeadsForUnlock, this.contacts[x]._id);
                }
            }
        }else {
            if (event.target.checked) {
                this.selectedLeadsIndex.push(i);
                this.selectedLeads.push(getN._id);
                this.selectedLeadsForUnlock.push(getN._id);
            } else {
                this.selectedLeadsIndex = arrayRemove(this.selectedLeadsIndex, i);
                this.selectedLeads = arrayRemove(this.selectedLeads, getN._id);
                this.selectedLeadsForUnlock = arrayRemove(this.selectedLeadsForUnlock, getN._id);
            }
        }
    },
    columns : ['linkedin_url', 'linkedin_username', 'facebook_url', 'twitter_url', 'industry', 'title', 'company_logo', 'company_name', 'domain', 'website', 'employee_count', 'company_linkedin_url', 'company_linkedin_username', 'company_location', 'company_city', 'company_state', 'company_country', 'company_address', 'location', 'city', 'state', 'country', 'zipcode', 'keywords', 'technologies', 'github_url', 'address', 'company_zipcode', 'gender', 'birth_year', 'company_founded', 'title_role', 'company_industry', 'linkedin_connections', 'inferred_salary', 'inferred_years_experience', 'summary', 'job_summary', 'company_keywords', 'inferred_salary_s', 'inferred_salary_e', 'employee_count_s', 'employee_count_e', 'image'],
    selectedColumns : [],
    selectColumn(event, column) {
        if (event.target.checked) {
            this.selectedColumns.push(column);
        } else {
            this.selectedColumns = arrayRemove(this.selectedColumns, column);
        }
    },
    makeCapital(str){
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    },
    unselectedAll() {
        console.log(123);
        this.selectedLeadsIndex = [];
        this.selectedLeads = [];
        this.selectedLeadsForUnlock = [];
        $(".row-select").prop("checked", false);
    },

    sliceIdsIntoChunks(chunkSize = 5) {
        let self = this;
        let chunkMail = [];
        for (let i = 0; i < self.selectedLeadsForUnlock.length; i += chunkSize) {
            const chunk = self.selectedLeadsForUnlock.slice(i, i + chunkSize);
            chunkMail.push(chunk);
        }
        return chunkMail;
    },
    unlockProspectEmail(id = "") {
        let self = this;
        if (id.length === 0) {
            if (this.selectedLeadsIndex.length === 0) {
                swalError('Please select email(s) which you wanted to verify', 'No Email are selected!');
                return;
            }
        } else {
            self.selectedLeadsForUnlock.push(id);
        }
        if (this.leadsCredits < this.selectedLeadsIndex.length || this.leadsCredits === 0) {
            swalError("Sorry you don't have enough credits to verify " + this.selectedLeadsIndex.length + " contacts.", 'Insufficient verification Credits!');
            return;
        }
        this.selectedLeadsForUnlock.map(el => {
            $('#' + el + '_email').addClass('blink-soft');
            $('#' + el + '_phone').addClass('blink-soft');
            $('#unlocking_email_lock_' + el).addClass('d-none');
            $('#unlocking_phone_lock_' + el).addClass('d-none');
            $('#unlocking_email_' + el).removeClass('d-none');
            $('#unlocking_phone_' + el).removeClass('d-none');
        });

        $('.btn-unlock').addClass('disabled');

        let chunkArr = this.sliceIdsIntoChunks();
        let ajaxPromise = $.when();
        console.log(chunkArr);
        chunkArr.forEach((chunk, i) => {
            ajaxPromise = ajaxPromise.then(function () {
                if (self.leadsCredits > 0) {
                    return self.sendingToUnlock(chunk);
                }
                // cleaning selected item of chunk from checkEmail items
                let chunkSet = new Set(chunk);

                self.selectedLeadsForUnlock = self.selectedLeadsForUnlock.filter((email) => {
                    return !chunkSet.has(email);
                });
            })
        });
        ajaxPromise.done(function (x) {
            self.selectedLeadsForUnlock = [];
            self.selectedIndex = [];
            $('.btn-verify').removeClass('disabled');
        });
    },
    sendingToUnlock(chunk) {
        let self = this;
        return $.ajax({
            url: $url + '/leads/unlock-email-phone',
            type: 'post',
            data: {ids: chunk},
            beforeSend: function () {
                //--
            },
            success: function (res) {
                // self.verifyProcess = false;
                if (res.success) {
                    self.leadsCredits = res.data.credits;

                    for (x in res.data.datas) {
                        $('#' + x).text(res.data.datas[x]);
                    }
                    chunk.map(el => {
                        $('#' + el + '_email').removeClass('blink-soft');
                        $('#' + el + '_phone').removeClass('blink-soft');
                        $('#unlocking_email_' + el).addClass('d-none');
                        $('#unlocking_phone_' + el).addClass('d-none');

                        // if ($('#check_' + el).is(':checked')) {
                        //     $('#check_' + el).trigger("click");
                        // }
                    });

                } else {
                    chunk.map(el => {
                        $('#' + el + '_email').removeClass('blink-soft');
                        $('#' + el + '_phone').removeClass('blink-soft');
                        $('#unlocking_email_lock_' + el).removeClass('d-none');
                        $('#unlocking_phone_lock_' + el).removeClass('d-none');
                        $('#unlocking_email_' + el).addClass('d-none');
                        $('#unlocking_phone_' + el).addClass('d-none');
                    });
                    swalError(res.msg,'Contact unlock failed');
                    // swalRedirect($url + '/billing?activeTab=leads-plan-tab', res.msg, 'danger', 'Upgrade Now!', 'Insufficient Leads Credits!');
                }
            },
            error: function (xhr, status, error) {
                chunk.map(el => {
                    $('#' + el + '_email').removeClass('blink-soft');
                    $('#' + el + '_phone').removeClass('blink-soft');
                    $('#unlocking_email_lock_' + el).removeClass('d-none');
                    $('#unlocking_phone_lock_' + el).removeClass('d-none');
                    $('#unlocking_email_' + el).addClass('d-none');
                    $('#unlocking_phone_' + el).addClass('d-none');
                });
                // self.unselectedAll();
            }
        });
    },
    unlockAll() {
        if (this.selectedLeads.length > 0) {
            this.unlockProspectEmail();
        } else {
            swalError('Please select to continue unlock');
        }
    },
    showCompanyInfo(i) {
        $('.details-dropdown').hide();
        $('#companyInfo-' + i).show();
    },
    hideCompanyInfo(i) {
        $('#companyInfo-' + i).hide();
    },

    //Leads
    addToListAction() {
        let self = this;
        if (this.saveLeads[this.listId].id) {
            if (this.selectedLeads.length > 0) {
                this.addingToList = true;
                makeAjaxPost({
                    listId: this.saveLeads[this.listId].id,
                    selectedLeads: this.selectedLeads
                }, $url + '/prospects/add-to-list', 'addingToList').done(res => {
                    if (res.success) {
                        if(res.data.warning){
                            swalWarning(res.msg, res.data.quantity+' lead(s) successfully added out of '+ this.selectedLeads.length);
                        }else{
                            swalSuccess(res.msg, 'Contacts Imported');
                        }
                        self.saveLeads[self.listId].quantity = (parseInt(self.saveLeads[self.listId].quantity) || 0) + (parseInt(res.data.quantity) || 0);
                        // self.companySyncingWithProspectUpload(res.data.batch_number);
                    } else {
                        swalError(res.msg, 'Lead Import Failed!');
                    }
                    self.addingToList = false;
                    self.listName = '';
                });
            } else {
                swalError('Please select contacts to upload.');
            }
        } else {
            swalError('Please select a list to upload.');
        }
    },
    companySyncingWithProspectUpload(batch) {
        let self = this;
        makeAjaxPost({
            batch_number: batch,
            sync_from: 'csv'
        }, $url + '/company/company-sync-with-prospect').done(res => {
            if (!res.success) {
                swalError(res.msg, 'Batch number not updated');
            }
            self.countSyncingStatus();
        });
    },

    createList() {
        let self = this;
        if (this.listName) {
            this.addingList = true;
            makeAjaxPost({name: this.listName}, $url + '/prospects/save-new-list', 'create-list-loading').done(res => {
                if (res.success) {
                    self.saveLeads.push(res.data);
                } else {
                    swalError(res.msg, 'Create list error!');
                }
                self.addingList = false;
                self.listName = '';
            });
        } else {
            swalError('List must required!');
        }
    },

    loadSaveLists() {
        let self = this;
        if (this.saveLeads.length === 0) {
            self.listLoading = true;
            makeAjax($url + '/prospects/get-prospect-list', false).done(res => {
                if (res.success) {
                    self.saveLeads = res.data
                } else {
                    swalError(res.msg, 'Get list error!');
                }
                self.listLoading = false;
            });
        }
    },

    downloadContacts() {
        if (this.selectedLeads.length > 0) {
            makeAjaxPost({selectedLeads: this.selectedLeads}, $url + '/leads/download-contacts').done(res => {
                if (res.success) {
                    var makeUrl = $url + "/downloads/" + res.data.file;
                    window.location.href = makeUrl;
                } else {
                    swalError(res.msg, 'Download contacts failed!')
                }
            });

        } else {
            swalError('Please select contacts for download', 'Download contacts failed!');
        }
    },

    selectSearch(getN){
        this.clearSearch(false);
        this.selectedSearchName = getN.name;
        this.formData = getN.query_data;
        this.searchFields = getN.search_fields;

        for (var variableKey in this.searchFields) {
            $('#' + variableKey).val(this.searchFields[variableKey]).trigger('change');
        }

        this.searchLeads();
    },
    saveSearchListLoading:true,
    saveSearchList:[],
    selectedSearchName:'Select a search',
    loadSaveSearch() {
        let self = this;
        self.saveSearchListLoading = true;
        makeAjax($url + '/leads/get-save-search').done(res => {
            if (res.success) {
                self.saveSearchList = res.data
            } else {
                swalError(res.msg, 'Get list error!');
            }
            self.saveSearchListLoading = false;
        });
    },

    saveSearch:{
        name : '',
        data : {},
        searchFields : {},
    },

    saveSearchAction(){
        let self = this;
        this.saveSearch.search_fields=this.searchFields;
        this.saveSearch.data=this.formData;
        // if (this.saveSearch.name.length === 0) {
            loader();
            makeAjaxPost(self.saveSearch, $url + '/leads/save-search').done(res => {
                if (res.success) {
                    self.saveSearchList.push(res.data);
                    $("#saveSearchModal").modal('hide');
                } else {
                    swalError(res.msg, 'Search saving failed!')
                }
                loader(false);
            });
        // }
    }
}
