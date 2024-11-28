document.addEventListener('DOMContentLoaded', function () {
    document.body.style.cursor = 'url("/cur/nor.cur"), pointer';

    document.addEventListener('selectstart', function () {
        document.body.style.cursor = 'url("/cur/text_select.cur"), text';
    });
    document.addEventListener('mouseup', function () {
        document.body.style.cursor = 'url("/cur/nor.cur"), pointer';
    });
    
    const clickableElements = document.querySelectorAll('a, button, .clickable, .site-page');
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            document.body.style.cursor = 'url("/cur/link_select.cur"), pointer';
        });

        element.addEventListener('mouseleave', function () {
            document.body.style.cursor = 'url("/cur/nor.cur"), pointer';
        });
    });
});