import {Component, Input, ElementRef, AfterViewInit} from '@angular/core';
import {OGraph} from './d3-graph/OGraph';

import * as $ from "jquery"
import './orientdb-graphviz'

import {downgradeComponent} from '@angular/upgrade/static';
import {NotificationService} from "../../core/services/notification.service";

declare var angular:any;
// declare var OrientGraph:any;

@Component({
  selector: 'graph',
  templateUrl: "./graph.component.html",
  styleUrls: []
})

class GraphComponent implements AfterViewInit {

  private orientGraph:OGraph;

  @Input() modellingConfig;
  private elementId = '#graph';
  private opts;

  constructor() {
    this.init();
  }

  init() {

    this.opts = {
      metadata: "no metadata",
      config: {
        height:460,
        width: 700,
        classes: {},
        node: {
          r: 15
        },
        linkDistance: 200,
        charge: -1000,
        friction: 0.9,
        gravity: 0.1
      },
      edgeMenu: [
        {
          name: '\uf044',
          onClick: function (e) {
            // if (e.edge) {
            //   $scope.showModal(e, e.edge["@rid"]);
            // }
          }


        },
        {
          name: '\uf06e',
          onClick: function (e) {

            // var title = "Edge (" + e.label + ")";
            // $scope.doc = e.edge;
            // Aside.show({
            //   scope: $scope,
            //   title: title,
            //   template: 'views/database/graph/asideEdge.html',
            //   show: true,
            //   absolute: false,
            //   fullscreen: $scope.fullscreen
            // });
          }
        },
        {
          name: '\uf127',
          onClick: function (e) {

            // var recordID = e['@rid']
            // Utilities.confirm($scope, $modal, $q, {
            //   title: 'Warning!',
            //   body: 'You are removing Edge ' + e.label + ' from ' + e.source["@rid"] + ' to ' + e.target["@rid"] + ' . Are you sure?',
            //   success: function () {
            //
            //
            //     var command = ""
            //     if (e.edge && e.edge["@rid"]) {
            //       command = "DELETE EDGE " + e.edge["@rid"];
            //     }
            //     else {
            //       command = "DELETE EDGE " + e.label + " FROM " + e.source["@rid"] + " TO " + e.target["@rid"] + " where @class='" + e.label + "'";
            //     }
            //
            //     CommandApi.queryText({
            //       database: $routeParams.database,
            //       language: 'sql',
            //       text: command,
            //       verbose: false
            //     }, function (data) {
            //       $scope.graph.removeEdge(e);
            //     });
            //   }
            // });

          }
        }
      ],
      menu: [
        {
          name: '\uf044',
          onClick: function (v) {
            // if (v['@rid'].startsWith("#-")) {
            //
            //   $scope.$apply(function () {
            //     Notification.push({content: 'Cannot edit a temporary node', autoHide: true, warning: true});
            //   });
            //
            // } else {
            //   $scope.showModal(v, v.source["@rid"]);
            // }
          }
        },

        {
          name: "\uf18e",
          onClick: function (v) {

          },
          submenu: {
            type: "tree",
            entries: function (v) {


              var acts = [];
              if (v.relationships && v.relationships.out) {


                v.relationships.out.forEach(function (elem) {
                  var name = elem.replace("out_", "");
                  name = (name != "" ? name : "E");
                  var nameLabel = name;
                  var nameLabel = (name != "" ? name : "E");
                  if (v.relCardinality && v.relCardinality["out_" + name]) {
                    nameLabel += " (" + v.relCardinality["out_" + name] + ")"
                  }
                  acts.push(
                    {
                      name: nameLabel,
                      label: name,
                      onClick: function (v, label) {

                        // if (v['@rid'].startsWith("#-")) {
                        //
                        //   $scope.$apply(function () {
                        //     Notification.push({
                        //       content: 'Cannot navigate relationship of a temporary node',
                        //       autoHide: true,
                        //       warning: true
                        //     });
                        //   });
                        //
                        // } else {
                        //   if (label == "E") {
                        //     label = "";
                        //   }
                        //   else {
                        //     label = "'" + label + "'";
                        //   }
                        //
                        //   var props = {rid: v['@rid'], label: label};
                        //   var query = "traverse out({{label}})  from {{rid}} while $depth < 2 "
                        //   var queryText = S(query).template(props).s;
                        //
                        //
                        //   CommandApi.graphQuery(queryText, {
                        //     database: $routeParams.database,
                        //     language: 'sql',
                        //     limit: -1
                        //   }).then(function (data) {
                        //     $scope.graph.data(data.graph).redraw();
                        //   })
                        //
                        // }
                      }
                    }
                  )

                })
              }
              return acts;
            }

          }

        },
        {
          name: "...",
          onClick: function (v) {

          },
          submenu: {
            type: "pie",
            entries: [
              {
                name: "\uf014",
                placeholder: "Delete",
                onClick: function (v, label) {

                  // if (v['@rid'].startsWith("#-")) {
                  //
                  //   $scope.$apply(function () {
                  //     Notification.push({content: 'Cannot delete a temporary node', autoHide: true, warning: true});
                  //   });
                  //
                  // } else {
                  //   var recordID = v['@rid']
                  //   Utilities.confirm($scope, $modal, $q, {
                  //     title: 'Warning!',
                  //     body: 'You are removing Vertex ' + recordID + '. Are you sure?',
                  //     success: function () {
                  //       var command = "DELETE Vertex " + recordID;
                  //       CommandApi.queryText({
                  //         database: $routeParams.database,
                  //         language: 'sql',
                  //         text: command,
                  //         verbose: false
                  //       }, function (data) {
                  //         $scope.graph.removeVertex(v);
                  //       });
                  //     }
                  //   });
                  // }
                }
              },
              {
                name: "\uf12d",
                placeholder: "Remove from canvas",
                onClick: function (v, label) {
                  // $scope.graph.removeVertex(v);

                }
              }

            ]
          }
        },
        {
          name: "\uf0c1",
          placeholder: "Connect",
          onClick: function (v) {

            // if (v['@rid'].startsWith("#-")) {
            //
            //   $scope.$apply(function () {
            //     Notification.push({content: 'Cannot connect a temporary node', autoHide: true, warning: true});
            //   });
            //
            // } else {
            //
            //   $scope.graph.startEdge();
            // }
          }
        },
        {
          name: "\uf18e",
          onClick: function (v) {

          },
          submenu: {
            type: "tree",
            entries: function (v) {

              var acts = [];
              if (v.relationships || v.relationships.in) {

                v.relationships.in.forEach(function (elem) {
                  var name = elem.replace("in_", "");
                  name = (name != "" ? name : "E");
                  var nameLabel = name;
                  if (v.relCardinality && v.relCardinality["in_" + name]) {
                    nameLabel += " (" + v.relCardinality["in_" + name] + ")"
                  }
                  acts.push(
                    {
                      name: nameLabel,
                      label: name,
                      onClick: function (v, label) {
                        // if (label == "E") {
                        //   label = "";
                        // }
                        // else {
                        //   label = "'" + label + "'";
                        // }
                        //
                        // var props = {rid: v['@rid'], label: label};
                        // var query = "traverse in({{label}})  from {{rid}} while $depth < 2 "
                        // var queryText = S(query).template(props).s;
                        //
                        //
                        // CommandApi.graphQuery(queryText, {
                        //   database: $routeParams.database,
                        //   language: 'sql',
                        //   limit: -1
                        // }).then(function (data) {
                        //   $scope.graph.data(data.graph).redraw();
                        // })

                      }
                    }
                  )
                })
              }
              return acts;
            }

          }
        },
        {
          name: "\uf06e",
          onClick: function (v) {
            // $scope.doc = v.source;
            // var title = $scope.doc['@class'] + " - " + $scope.doc['@rid']
            // Aside.show({
            //   scope: $scope,
            //   title: title,
            //   template: 'views/database/graph/asideVertex.html',
            //   show: true,
            //   absolute: false,
            //   fullscreen: $scope.fullscreen
            // });

          }
        }
      ]
    }
  }

  ngAfterViewInit() {
    this.loadGraph();
  }


  loadGraph() {
    if(this.opts.config) {
      this.orientGraph = new OGraph(this.elementId, this.opts.config);
      this.orientGraph.data(this.modellingConfig).draw();
    }
  }

}

angular.module('graph.component', []).directive(
  `graph`,
  downgradeComponent({component: GraphComponent}));


export {GraphComponent};
