import React from 'react';
import { WebView } from 'react-native-webview';
/**
 *
 * @param {*} onMessage: callback after received response, error of Google captcha or when user cancel
 * @param {*} siteKey: your site key of Google captcha
 * @param {*} style: custom style
 * @param {*} url: base url
 * @param {*} languageCode: can be found at https://developers.google.com/recaptcha/docs/language
 */
const GoogleReCaptcha = ({ onMessage, siteKey, style, url, languageCode }) => {
    const generateTheWebViewContent = siteKey => {
        const originalForm = `<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="X-UA-Compatible" content="ie=edge">
				<script src="https://recaptcha.google.com/recaptcha/api.js?explicit&hl=${languageCode ||
            'en'}"></script>
				<script type="text/javascript">
					var onloadCallback = function () { };
					
                    var onDataCallback = function (response) { 
						window.ReactNativeWebView.postMessage(response) 
					};
					
                    var onDataExpiredCallback = function (error) { 
						window.ReactNativeWebView.postMessage("expired"); 
						setTimeout(() => window.setupObservers(), 1000);
					};

					var onDataErrorCallback = function (error) { 
						window.ReactNativeWebView.postMessage("error"); 
					}

                    window.setupObservers = function () {
                        this.document.body.style.visibility = 'visible';
                        const iframes = document.getElementsByTagName('iframe');
                        let iframe = iframes[iframes.length - 1];
                        if (
                            iframe &&
                            iframe.parentElement &&
                            iframe.parentElement.parentElement
                        ) {
                            var target = iframe.parentElement.parentElement;
                            var observer = new MutationObserver(function (mutations) {
                                mutations.forEach(function () {
                                    let contentParams = {
                                        height: iframe.clientHeight,
                                        visibility: target.style.visibility,
                                    };
                                    window.ReactNativeWebView.postMessage("CONTENT_PARAMS:" + JSON.stringify(contentParams));
                                });
                            });
                            observer.observe(target, {
                                attributes: true,
                                attributeFilter: ['style'],
                            });
                        }
                    };
                    
                    setTimeout(window.setupObservers, 2000)
				</script>
			</head>
			<body style="visibility:hidden;">
				<div id="captcha" style="text-align: center">
					<div class="g-recaptcha" style="display: inline-block;"
						data-sitekey="${siteKey}" data-callback="onDataCallback"
						data-expired-callback="onDataExpiredCallback"
						data-error-callback="onDataErrorCallback">
					</div>
				</div>
			</body>
			</html>`;
        return originalForm;
    };
    return (
        <WebView
            originWhitelist={['*']}
            mixedContentMode={'always'}
            onMessage={onMessage}
            javaScriptEnabled={true}
            automaticallyAdjustContentInsets={true}
            style={[{ backgroundColor: 'transparent', width: '100%' }, style]}
            source={{
                html: generateTheWebViewContent(siteKey),
                baseUrl: `${url}`,
            }}
        />
    );
};

export default GoogleReCaptcha;