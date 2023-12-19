<!doctype html>
<html lang="en">
    <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="polyuno" content="{{ csrf_token() }}"/>
        <title>
            @if(isset($title) & !empty($title))
                {{ $title }}
            @else
                @yield('title')
            @endif
        </title>
        <link rel="icon" type="image/png" href="{{url('backend')}}/images/favicon.svg"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.min.css">
        <link href="{{asset('vendors/ladda/ladda-themeless.min.css')}}" rel="stylesheet">
        <link href="{{url('backend')}}/css/style.css" rel="stylesheet">
        <link href="{{url('backend')}}/css/responsive.css" rel="stylesheet">
        <link href="{{url('backend')}}/css/prospect.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
        @stack('css')
    </head>
    <body x-data="root" x-init="siteInit">
        <!-- Page Main content -->
        <div class="main">
            @yield('content')
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js"></script>
        <script src="{{asset('vendors/ladda/spin.min.js')}}"></script>
        <script src="{{asset('vendors/ladda/ladda.min.js')}}"></script>
        <script src="{{asset('vendors/ladda/ladda.jquery.min.js')}}"></script>
        <script src="{{url('vendors/tippy/popper.min.js')}}"></script>
        <script src="{{url('vendors/tippy/tippy-bundle.umd.min.js')}}"></script>
        <script src="{{url('vendors/main/app.js')}}"></script>
        <script>
            $url = "{{url('/')}}";
            $(document).ready(() => {
                setInterval(() => {
                    $('.placeholder-content').each(function () {
                        // let $h = globalJs.getRandomArbitrary(30, 50);
                        let $w = root.getRandomArbitrary(30, 100);
                        $(this).css('width', $w + '%');
                    });
                }, 1500);
            });
        </script>
        @stack('js')
    </body>
</html>
