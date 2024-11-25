function copyPostLink() {
    const postLink = window.location.href;

    navigator.clipboard.writeText(postLink).then(() => {
        utils.snackbarShow("当前页面链接已复制到剪贴板", false, 2000);
    }).catch(err => {
        console.error("无法复制链接:", err);
        utils.snackbarShow("复制失败，请重试", false, 2000);
    });
}