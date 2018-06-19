import { Component, OnInit } from '@angular/core';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(".toggle").click(function () {
      var childs = $(this).prev().children();
      $(childs[0]).toggle();
      $(childs[1]).toggle();
      $(this).next().fadeToggle('fast');
    });
    $(".expand").click(function () {
      $(this).toggle();
      $(this).next().toggle();
      $(this).parent().parent().children().last().fadeToggle('fast');
    });
    $(".collapse").click(function () {
      $(this).toggle();
      $(this).prev().toggle();
      $(this).parent().parent().children().last().fadeToggle('fast');
    });
  }

}
