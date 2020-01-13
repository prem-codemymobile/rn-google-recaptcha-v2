
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

#### 2. Link react-native-webview dependency

From react-native 0.60 autolinking will take care of the link step but don't forget to run `pod install`

React Native modules that include native Objective-C, Swift, Java, or Kotlin code have to be "linked" so that the compiler knows to include them in the app.

```
$ react-native link react-native-webview
```

iOS:

If using cocoapods in the `ios/` directory run
```
$ pod install
```

Android - react-native-webview version <6:
This module does not require any extra step after running the link command 🎉

Android - react-native-webview version >=6.X.X:
Please make sure AndroidX is enabled in your project by editting `android/gradle.properties` and adding 2 lines:

```
android.useAndroidX=true
android.enableJetifier=true
```

For Android manual installation, please refer to [this article](https://engineering.brigad.co/demystifying-react-native-modules-linking-964399ec731b) where you can find detailed step on how to link any react-native project.

For iOS, while you can manually link the old way using [react-native own tutorial](https://facebook.github.io/react-native/docs/linking-libraries-ios), we find it easier to use cocoapods.
If you wish to use cocoapods and haven't set it up yet, please instead refer to [that article](https://engineering.brigad.co/demystifying-react-native-modules-linking-ae6c017a6b4a).

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


**MIT Licensed**
