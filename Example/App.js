import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet
} from 'react-native';
import GoogleReCaptcha from 'rn-google-recaptcha-v2';

const siteKey = 'you_site_key';
const baseUrl = 'base_url';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recaptchaViewHeight: 90 //initial default height
    };
  }

  render() {
    const { recaptchaViewHeight } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleText}>RN Google reCAPTCHA V2 Demo</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 50
  },
  titleText: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20
  }
});
