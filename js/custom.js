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

document.querySelector('.tk-preview').addEventListener('click', function(event) {
    event.preventDefault(); // 阻止默认事件，防止页面跳转
  
    const commentContent = document.querySelector('.tk-meta-input .el-input__inner').value; // 获取评论内容
    const previewContainer = document.querySelector('.tk-comment-preview'); // 创建或选择一个用于展示预览的区域
    
    if (!previewContainer) {
      const newPreviewContainer = document.createElement('div');
      newPreviewContainer.className = 'tk-comment-preview';
      document.querySelector('.tk-submit').appendChild(newPreviewContainer);
    }
  
    // 显示预览内容
    document.querySelector('.tk-comment-preview').innerHTML = `
      <h4>评论预览:</h4>
      <p>${commentContent}</p>
    `;
  });