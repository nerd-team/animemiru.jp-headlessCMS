import Script from 'next/script'

export function ThemeScripts() {
  return (
    <>
      <Script src="https://code.jquery.com/jquery-3.7.1.min.js" strategy="afterInteractive" />
      <Script src="/theme/js/slick.js" strategy="afterInteractive" />
      <Script src="/theme/js/base.js" strategy="afterInteractive" />
      <Script id="animemiru-slick-init" strategy="afterInteractive">
        {`
          jQuery(function($) {
            var $slider = $('.post-slider.header-post-slider');
            if ($slider.length && !$slider.hasClass('slick-initialized')) {
              var options = $slider.data('slick') || {
                slidesToShow: 1,
                slidesToScroll: 1,
                adaptiveHeight: true,
                autoplay: true,
                dots: false,
                autoplaySpeed: 5000,
                fade: true
              };
              $slider.slick(options);
            }
          });
        `}
      </Script>
    </>
  )
}
