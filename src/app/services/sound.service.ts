import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { buffer } from 'rxjs/operator/buffer';
import { EventManager } from './event-manager.service';

@Injectable()
export class SoundService {

  audioMap = {};
  currentAudio: any;
  context: any;
  constructor(private http: HttpClient, private eventManager: EventManager) {


    this.context = new window['AudioContext']() || new window['webkitAudioContext']();
  }


  fetchAudio(audio: string) {

    if (this.audioMap[audio]) {
      return;
    }

    return this.http.get(audio, { responseType: 'arraybuffer' }).map((buffer) => {
      this.context.decodeAudioData(buffer, (abuffer) => {
        this.audioMap[audio] = abuffer;
      });

    })
  }

  fetchAudios(arr: Array<string>) {

    return Observable.forkJoin(arr.map((src, i) =>
      this.http.get(src, { responseType: 'arraybuffer', reportProgress: true }).map((buffer) => {
        this.context.decodeAudioData(buffer, (abuffer) => {
          this.audioMap[src] = abuffer;
        });
      })
    )).subscribe((buffer) => {
      console.log('Audio loading complete');
    })
  }

  /*
    play(audio:string) - when called plays the current audio playing
    @{param} audio - name/path of the audio

  */
  play(audio: string) {

    //if audio is already playing
    if (this.currentAudio) this.stop();

    //if audio not fetched already 
    if (!this.audioMap[audio]) {
      this.fetchAudio(audio).subscribe(() => {
        this.play(audio);
      });
      return;
    }

    this.currentAudio = this.createSource(this.audioMap[audio]);

    if (this.currentAudio.source.start) {
      this.currentAudio.source.start(0);
    } else {
      this.currentAudio.source.noteOn(0);
    }

    this.currentAudio.source.onended = () => {
      this.eventManager.broadcast('playended', this.currentAudio); //current audio play ended
    }

  }


  /*
    stop() - when called stops the current audio playing
  */
  stop() {

    if (!this.currentAudio) return;

    if (this.currentAudio.source.stop) {
      this.currentAudio.source.stop(0);
    } else {
      this.currentAudio.noteOff(0);
    }
    this.currentAudio = null;
  }

  createSource(buffer) {
    let source = this.context.createBufferSource(),
      gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
    source.buffer = buffer;

    // Connect source to gain.
    source.connect(gainNode); // if audio volume modification is required.
    // Connect gain to destination.
    gainNode.connect(this.context.destination);

    return {
      source: source,
      gainNode: gainNode
    }
  }
}
