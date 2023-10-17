import { Component, Input, OnInit } from '@angular/core';
import { ReactionService } from '../../services/reaction.service';

@Component({
  selector: 'app-reactionlist',
  templateUrl: './reactionlist.component.html',
  styleUrls: ['./reactionlist.component.scss']
})
export class ReactionlistComponent implements OnInit {

  @Input() publication!: string;
  @Input() comment!: string;
  public reactions: any;

  constructor(
    private readonly _reactionService: ReactionService,
  ) { }

  ngOnInit(): void {
    this.getCountReactions();
  }

  getCountReactions(): void {
    if ( this.publication ) {
      this._reactionService.getReactionsIn('publication', this.publication ).subscribe(( response: any ) => {
        this.reactions = ( !response.message ) && response.data.reactions;
      })
    } else if ( this.comment ) {
      console.log( this.comment );
    }
  }

  createReaction( type: string ): void {
    let reaction = {};
    ( this.publication ) ? reaction = { type, publication: this.publication } 
      : reaction = { type, comment: this.comment } ;
    
    this._reactionService.createReaction( reaction ).subscribe(( response: any ) => {
      ( response ) && this.getCountReactions();
    })
  }

}
