import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import querystring from 'querystring';
import WebView, {WebViewNavigation} from 'react-native-webview';

const REDIRECT_URI = 'http://localhost:8081/auth'; // this needs to be the same as your LinkedIn app panel
const CLIENT_ID = '86fto5sct9z7xl'; // you can get it from the LinkedIn apps panel
// const CLIENT_SECRET = '0IrMTMfkXXWrmV1m'; //you can get it from the LinkedIn apps panel
const AUTH_BASE = 'https://www.linkedin.com/oauth/v2/authorization';
const SCOPE = 'openid,email,profile';

const qs = [
  `client_id=${CLIENT_ID}`,
  `response_type=code`,
  `scope=${SCOPE}`,
  `redirect_uri=${REDIRECT_URI}`,
];

const AUTH_ENDPOINT = `${AUTH_BASE}?${qs.join('&')}`;

const LinkedInAuth = () => {
  const [token, setToken] = useState('');

  const loadStart = ({url}: WebViewNavigation) => {
    if (!url) {
      return;
    }
    const matches = url.match(REDIRECT_URI);
    if (matches && matches.length && url) {
      const obj = querystring.parse(url.split('?').pop() as string);
      if (obj.code) {
        setToken(obj.code as string);
        console.log('---->>>', obj.code);
      }
    }
  };

  const renderContent = () => {
    if (token) {
      return <Text>Auth success: {token}</Text>;
    } else {
      return (
        <WebView
          style={styles.wv}
          source={{uri: AUTH_ENDPOINT}}
          javaScriptEnabled
          domStorageEnabled
          onNavigationStateChange={loadStart}
        />
      );
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wv: {
    flex: 1,
    width: 380,
    height: 300,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
});

export default LinkedInAuth;
