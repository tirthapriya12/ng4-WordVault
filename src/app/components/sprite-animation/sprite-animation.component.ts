import { Component, OnInit, ViewChild } from '@angular/core';
import { EventManager } from '../../services/event-manager.service';
@Component({
  selector: 'app-sprite-animation',
  templateUrl: './sprite-animation.component.html',
  styleUrls: ['./sprite-animation.component.css']
})
export class SpriteAnimationComponent implements OnInit {

  constructor(private eventManager: EventManager) {

    this.eventManager.on('animate', (data) => {

      this.animate(data);
    });
  }

  @ViewChild('sprite') sprite: any;

  animationData = [];
  frameCounter = 0;
  ngOnInit() {
  }

  animate(animationData) {
    this.animationData = animationData;
    window.requestAnimationFrame(() => {
      this.startAnimation();
    });
    
  }

  startAnimation() {

    if (this.frameCounter === this.animationData.length) {
      this.animationData = [];
      this.frameCounter = 0;
      this.eventManager.broadcast('animationcomplete', true);
      return;
    }

    this.sprite.nativeElement['style'].backgroundPositionX = this.animationData[this.frameCounter].x +'px';
    this.sprite.nativeElement['style'].backgroundPositionY = this.animationData[this.frameCounter].y + 'px';
    this.frameCounter++;


    window.requestAnimationFrame(this.startAnimation.bind(this));
  }

}
