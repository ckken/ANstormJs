var html = {
//delhtml
    delHtmlTag: function (str) {
        return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
    }
}

module.exports = html;