
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
  Alert,
  Dimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

const { width, height } = Dimensions.get('window');
const fieldY = 100;
const fieldWidth = 200;
const fieldHeight = 50;

// disable 畫面上的 yellowBox 視窗
console.disableYellowBox = true;

export default class App extends Component {
  state = { text: ''}
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.field}></View>
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style = {styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
            onTextRecognized={(t) => {
              // 影像辨識拿到的資料
              console.log(t);
              if (t.textBlocks.length > 0) {
                t.textBlocks.map((block) => {
                  if (block.bounds.origin.y > fieldY && block.bounds.origin.y < (fieldY + fieldHeight)) {
                    let keyPair = block.value.trim();
                    // 自我 training 修正資料 xD
                    this.setState({
                      text: keyPair.replace('D',0)
                                  .replace('o',0)
                                  .replace('O',0)
                                  .replace('U',0)
                                  .replace('H',4)
                                  .replace('Y',4)
                                  .replace('S',5)
                                  .replace('s',5)
                                  .replace('B',8)
                                  .replace('E',8)
                                  .replace('T',1)
                                  .replace(' ','')
                                  .replace(' ','')
                                  .replace('.','')
                    })
                  }
                });
              }
            }}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
        <TouchableOpacity
            // 當按下時，將現有UI上看到的 key 傳入getPairKey 裡
            onPress={() => { this.getPairKey(this.state.text) }}
            style = {styles.capture}
        >
            <Text style={{fontSize: 14}}> {this.state.text} </Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

  getPairKey (keyPair) {
    // 按下 OK 會將傳入的的keyPair 寫入剪貼版
    Alert.alert(
      'Set Clipboard to',
      `${keyPair}`,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => Clipboard.setString(keyPair)},
      ],
      { cancelable: false }
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  },
  field: {
    position: 'absolute',
    top: fieldY,
    left: (width - fieldWidth) / 2,
    width: fieldWidth,
    height: fieldHeight,
    borderWidth: 3,
    borderColor: 'blue',
    zIndex: 1,
  }
});
