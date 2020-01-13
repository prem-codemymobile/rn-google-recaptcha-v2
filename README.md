
# rn-google-recaptcha-v2
##### Implement Google recaptcha v2 in React Native (both Android and iOS)
Our package uses `react-native-webview` under the hood to bring you the functionality of auto-resizable google recaptcha v2 using webview. This solves the problem of resizing webview content when using google recaptcha v2.

## Installation

#### 1. Add rn-google-recaptcha-v2 to your project

```
$ yarn add rn-google-recaptcha-v2
```

For npm use
```
$ npm install --save rn-google-recaptcha-v2
```

#### 2. Add react-native-webview dependency to your project

Follow the instructions on the [React Native WebView Getting Started Guide](https://github.com/react-native-community/react-native-webview/blob/master/docs/Getting-Started.md) to add `react-native-webview` dependency to your project

## Usage

```javascript
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import GoogleReCaptcha from 'rn-google-recaptcha-v2';

const siteKey = 'you_site_key';
const baseUrl = 'base_url';

export default class App extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            recaptchaViewHeight: 90 //initial default height
        };
    }

    render() {
        const { recaptchaViewHeight } = this.state;
        return (
            <SafeAreaView style={{flex:1}}>
                <GoogleReCaptcha
                    style={{ height: recaptchaViewHeight }}
                    siteKey={siteKey}
                    url={baseUrl}
                    languageCode="en"
                    onMessage={this.onRecaptchaEvent} />
            </SafeAreaView>
        );
    }

    onRecaptchaEvent = event => {
        if (event && event.nativeEvent.data) {
            const data = decodeURIComponent(
                decodeURIComponent(event.nativeEvent.data),
            );
            if (data.startsWith('CONTENT_PARAMS:')) {
                let params = JSON.parse(data.substring(15));
                let recaptchaViewHeight = params.visibility === 'visible' ? params.height : 90;
                this.setState({ recaptchaViewHeight });
            } else if (['cancel', 'error', 'expired'].includes(data)) {
                return;
            } else {
                console.log('Verified code from Google', data);
                this.setState({ recaptchaToken: data });
            }
        }
    };
}
```


## Props

- **`siteKey`** _(String)_ - The site key of the Google Recaptcha.
- **`baseUrl`** _(String)_ The url domain defined on your Google Recaptcha.
- **`onMessage`** _(Function)_ - The callback function  after received response, error of Google captcha or when user cancel
- **`languageCode`** _(String)_ - Language to be display of captcha form. Can be found at [this link](https://developers.google.com/recaptcha/docs/language)


## License

MIT
