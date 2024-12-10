document.addEventListener('DOMContentLoaded', function () {
    document.body.style.cursor = 'url("/cur/nor.cur"), auto';

    document.querySelectorAll('a, button, .clickable').forEach(element => {
        element.addEventListener('mouseenter', function () {
            document.body.style.cursor = 'url("/cur/link_select.cur"), pointer';
        });
        element.addEventListener('mouseleave', function () {
            document.body.style.cursor = 'url("/cur/nor.cur"), auto';
        });
    });

    document.querySelectorAll('textarea, input, select').forEach(element => {
        element.addEventListener('mouseenter', function () {
            document.body.style.cursor = 'url("/cur/text_select.cur"), text';
        });
        element.addEventListener('mouseleave', function () {
            document.body.style.cursor = 'url("/cur/nor.cur"), auto';
        });
    });
});

let progress = 0;
const interval = setInterval(() => {
  progress += Math.random() * 10;
  document.documentElement.style.setProperty('--loading-progress', `${Math.min(progress, 100)}%`);
  if (progress >= 100) {
    clearInterval(interval);
  }
}, 300);

function finishLoading() {
    const pace = document.querySelector('.pace');
    pace.classList.add('pace-inactive');
  }

setTimeout(() => {
    document.querySelector('.pace').classList.add('pace-inactive');
  }, 2000);
