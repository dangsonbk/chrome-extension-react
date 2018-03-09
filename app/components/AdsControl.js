import { getLocalSettings } from '../utils/settings';
import $ from 'jquery';

function removeAds() {
    $('head').append(`<style>[id^=div-gpt-ad],[id^=google_ads_div],.middleads,[id^=ads_zone], tbody > tr > td:nth-child(2)[width="160"]{
  display: none}
  [align="center"] > div.page{ width:100%!important }
}</style>`);
  if ($('.middleads+table > tbody > tr > td:eq(1) [id^=div-gpt-ad]').length > 0) {
    $('.middleads+table > tbody > tr > td:eq(1)').remove();
  }
  $('.middleads+div > table > tbody > tr > td:eq(1)').remove();
  $('[id^=div-gpt-ad]').hide();
  $('[id^=google_ads_div],.middleads').hide();
}

export function AdsControl() {
    // const toRemove = document.querySelector('body > div > form');
    // if (toRemove && toRemove.remove) toRemove.remove();

    // https://userstyles.org/styles/154630/voz-forums-u23-vietnam-theme
  if (window.localStorage.getItem('survey_done') !== 'theNextVoz') {
    $(document.body).prepend(`
        <style>
        .important-survey {
          background: #000;
          color: white;
          padding: 5px 2px;
          font-size: 12px;
          font-weight: normal;
          font-family: 'Helvetica neue', 'Roboto', sans-serif;
          text-align: center;
          text-shadow: 0 0 1px rgba(0,0,0, 1);
          position: relative;
        }
        .important-survey a {
          color: #f9f996 !important;  
        }
        .important-survey a.close {
          color: white !important;
          font-size: 11px;
          display: block;
          padding: 2px;
          position: absolute;
          top: 3px;
          right: 3px; 
        }
        </style>
        <div class="important-survey"><a href="https://vozforums.com/showpost.php?p=137163821&postcount=2193" target="_blank">VozLiving update phiên bản mới. Thêm nguồn imgur vào upload nhanh(trong settings), cải thiện hiệu năng, cho phép dùng nhiều style, giảm lag khi post bài(có thể tắt ở settings)</a></div>
      `);
    const closeBtn = $('<a href="#" class="close">OK ×</a>');
    $('.important-survey').append(closeBtn);
    closeBtn.click(() => {
      window.localStorage.setItem('survey_done', 'theNextVoz');
      $('.important-survey').fadeOut(300);
    });
  }

  let isRemoved = false;
  if (localStorage.getItem('adsRemove') === 'true') {
    setTimeout(() => {
      removeAds();
    }, 50);
    isRemoved = true;
  }

  getLocalSettings()
      .then((settings) => {
        if (settings.adsRemove === true && !isRemoved) {
          removeAds();
        }
        localStorage.setItem('adsRemove', settings.adsRemove === true ? 'true' : 'false');
      });
}

