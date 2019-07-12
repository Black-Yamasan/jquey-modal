/**
 * jquery-modal
 */

;(function($) {
  $.fn.modal = function(options) {
    var modalOptions = $.extend( {}, $.fn.modal.defaults, options );
    var $el = $(this);
    var $open = $(modalOptions.$open);
    var $close = $el.find(modalOptions.$close);
    var $overlay = $(modalOptions.$overlay);
    var $html = $('html');
    var $body = $('body');
    var $closeTarget = null;

    // options
    var isOpenAddClassName = modalOptions.isOpenAddClassName;
    var animeSpeed = modalOptions.animeSpeed;

    var isChangeView = false;

    function openModal() {
      if ( isChangeView ) return false;
      isChangeView = true;
      $html.addClass(isOpenAddClassName);
      $body.addClass(isOpenAddClassName);
      $overlay.css({ display: 'block' });
      $overlay.stop().animate({
        opacity: 1
      }, animeSpeed*0.5, 'linear', function() {
        $el.stop().animate({
          opacity: 1
        }, animeSpeed, 'linear', function() {
          $el.css({ display: 'block' });
          $el.scrollTop(0);
          isChangeView = false;
        });
      });
    }

    function closeModal() {
      if ( isChangeView ) return false;
      isChangeView = true;
      $el.stop().animate({
        opacity: 0
      }, animeSpeed, 'linear', function() {
        $el.css({ display: 'none' });
        $overlay.css({ display: 'none', opacity: 0 });
        $html.removeClass(isOpenAddClassName);
        $body.removeClass(isOpenAddClassName);
        isChangeView = false;
      });
    }

    $open.on('click', function() {
      openModal();
    });

    $close.on('click', function(e) {
      $closeTarget = $(e.target);
      if ( $closeTarget[0] !== $(this)[0] ) return false;
      closeModal();
    });

  };

  $.fn.modal.defaults = {
    $open: '.js-modalOpen', // モーダルを開く為の要素
    $close: '.js-modalClose', // モーダルを閉じる要素,
    $overlay: "#js-modalOverlay",
    isOpenAddClassName: 'is-open-modal', // モーダルを開いた後にhtmlとbodyに追加するクラス名
    animeSpeed: 150 // モーダルのfadeスピード
  };
})(jQuery);