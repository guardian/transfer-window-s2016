export default function clubList(title) {
    console.log('club')

    var twImgText = twImg ? ` ${twImg.trim()} ` : ' ';
    var fbImgQry = fbImg ? `&picture=${encodeURIComponent(fbImg)}` : '';
    return function (network, extra='') {
        var twitterMessage = `${extra}${title}${twImgText}${hashTag}`;
        var shareWindow;

        if (network === 'twitter') {
            shareWindow = twitterBaseUrl + encodeURIComponent(twitterMessage + ' ') + shareURL;
        } else if (network === 'facebook') {
            shareWindow = facebookBaseUrl + shareURL + fbImgQry;
        } else if (network === 'email') {
            shareWindow = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + shareURL;
        } else if (network === 'google') {
            shareWindow = googleBaseUrl + shareURL;
        }

        window.open(shareWindow, network + 'share', 'width=640,height=320');
    }
}
