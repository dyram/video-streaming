/* eslint-disable */
import React, { Component } from "react";

import "./App.css";

import "video.js/dist/video-js.css";
import videojs from "video.js";

import "webrtc-adapter";
import RecordRTC from "recordrtc";

/*
// Required imports when recording audio-only using the videojs-wavesurfer plugin
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
WaveSurfer.microphone = MicrophonePlugin;

// Register videojs-wavesurfer plugin
import 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css';
import Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
*/

// register videojs-record plugin with this import
import "videojs-record/dist/css/videojs.record.css";
import Record from "videojs-record/dist/videojs.record.js";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Optional imports for videojs-record plugins
/*
// webm-wasm plugin (npm install webm-wasm @mattiasbuelens/web-streams-polyfill)
// Make sure to copy webm-worker.js and webm-wasm.wasm from
// node_modules/webm-wasm/dist/ to the project's public directory
import '@mattiasbuelens/web-streams-polyfill/dist/polyfill.min.js';
import 'videojs-record/dist/plugins/videojs.record.webm-wasm.js';

// ts-ebml plugin (npm install ts-ebml)
import 'videojs-record/dist/plugins/videojs.record.ts-ebml.js';
*/

class App extends Component {
  notify() {
    toast("Recording has begun!", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 1500,
      draggable: false
    });
  }

  endNotify() {
    toast("Finished Recording!", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 1500,
      draggable: false
    });
  }

  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, () => {
      // print version information at startup
      var version_info =
        "Using video.js " +
        videojs.VERSION +
        " with videojs-record " +
        videojs.getPluginVersion("record") +
        " and recordrtc " +
        RecordRTC.version;
      videojs.log(version_info);
    });

    // device is ready
    this.player.on("deviceReady", () => {
      console.log("Device ready");
    });

    // user clicked the record button and started recording
    this.player.on("startRecord", () => {
      this.notify();
    });

    // user completed recording and stream is available
    this.player.on("finishRecord", () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.

      this.endNotify();

      console.log("finished recording: ", this.player.recordedData);

      let fData = new FormData();
      fData.append("file", this.player.recordedData);

      Axios.post("http://localhost:3031/uploadMovie", fData).then(res => {
        console.log("Video Uploaded", res.data);
      });
    });

    // error handling
    this.player.on("error", (element, error) => {
      console.warn(error);
    });

    this.player.on("deviceError", () => {
      console.error("device error:", this.player.deviceErrorCode);
    });
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div className="record-div">
        <div className="record">
          <h1>Record your video....</h1>
          <p>Click on the player to begin recording</p>
          <div data-vjs-player>
            <video
              id="myVideo"
              ref={node => (this.videoNode = node)}
              className="video-js vjs-default-skin"
              playsInline
            ></video>
          </div>
          <ToastContainer />
        </div>
      </div>
    );
  }
}

export default App;
