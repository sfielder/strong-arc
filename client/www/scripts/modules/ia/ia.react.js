/** @jsx React.DOM */
/*
*
*   Main Nav Container
*
* */
var IAMainNavContainer = (IAMainNavContainer = React).createClass({


  render: function() {

    var scope = this.props.scope;
    var singleClickItem = function(event) {
      if (event.target.attributes['data-id']){
        scope.$apply(function () {
          scope.navTreeItemClicked('root', event.target.attributes['data-id'].value, event.metaKey);
        });
      }
    };
    return (
      <div>
        <span className="ia-project-title-container">[project name goes here]</span><div className="main-nav-help"><span id="mainNavContextHelp" data-id="MainNavContextHelp" className="glyphicon glyphicon-question-sign"></span></div>
        <IAMainModelNav scope={this.props.scope} />
        <IAMainDatasourceNav scope={this.props.scope} />
      </div>
      );
  }
});
/*
*
*   Model Main Nav
*
* */
var IAMainModelNav = (IAMainModelNav = React).createClass({
  openSelectedModels:function(key, opt) {
    var that = this;
    that.props.scope.$apply(function () {
      that.props.scope.openSelectedModels();
    });
  },
  deleteSelectedModel: function(key, opt) {
    var scope = this.props.scope;
    console.log('key: ' + key);
    console.log('opt' + opt);
    try{
      if (opt.sourceEvent.currentTarget.attributes['data-id']){
        var modelId = opt.sourceEvent.currentTarget.attributes['data-id'].value;
        scope.$apply(function(){
         scope.deleteModelDefinitionRequest(modelId);
        });

      }
    }
    catch(error) {
      console.warn('error deleting model definition: ' + error);
    }

  },
  componentDidMount:function(){
    var menuItems = {};
    var currentContextId = null;
    menuItems.openSelectedModels = {name: "open", callback: this.openSelectedModels};
    menuItems.deleteSelectedModel = {name: "delete", callback: this.deleteSelectedModel};
    $.contextMenu({
      // define which elements trigger this menu
      selector: ".model-node",
      // define the elements of the menu
      items: menuItems,
      events: {
        show: function(opt, event) {

        }
      }
    });
  },
  render: function() {

    var scope = this.props.scope;

    var modelSelectedCollection = [];
    var cx = React.addons.classSet;


    var clickBranch = function(event) {
      if (event.target.attributes['data-name']){
        scope.$apply(function () {
          scope.navTreeBranchClicked('model');
        });
      }
    };

    var singleClickItem = function(event) {

      if (event.target.attributes['data-id'] || event.target.parentElement.attributes['data-id']){
        var val = '';
        if (event.target.attributes['data-id']) {
          val = event.target.attributes['data-id'].value;
        }
        else {
          val = event.target.parentElement.attributes['data-id'].value;
        }
        scope.$apply(function () {
          scope.navTreeItemClicked('model', val, event.metaKey);
        });

      }

    };

    var addNewInstanceRequest = function(event) {
      scope.$apply(function() {
        scope.createModelViewRequest();
      });
    };
    var navModels = [];
    if (Array.isArray(scope.mainNavModels)) {
      navModels = scope.mainNavModels;
    }
    var items = navModels.map(function(item) {
      var classNameVar = 'model-node ';
      if (item.isActive) {
        classNameVar += ' is-active';
      }
      else if (item.isOpen) {
        classNameVar += ' is-open';
      }
      else if (item.isSelected) {
        classNameVar += ' is-selected'
      }
      return (
        <li className={classNameVar} data-id={item.id} >
          <button onClick={singleClickItem} data-name={item.name} data-id={item.id} className="btn btn-default btn-block nav-tree-item tree-node"><span data-name={item.name}  data-id={item.id} className="glyphicon glyphicon-file"></span>{item.name}</button>
        </li>
        );
    });
    return (
      <div>
        <button onClick={clickBranch} data-name="model_root" className="btn btn-default btn-block nav-tree-item tree-branch"  title="Models" ><span className="glyphicon glyphicon-folder-open"></span>Models</button>
        <ul className="branch-leaf-list is-open">{items}</ul>
        <button onClick={addNewInstanceRequest} data-type="model" className="nav-tree-item-addnew"><span className="plus">+</span>Add New Model</button>
      </div>
      );
  }
});
/*
*
*   Datasource Main Nav
*
* */
var IAMainDatasourceNav = (IAMainDatasourceNav = React).createClass({
  openSelectedDataSources:function(key, opt) {
    var that = this;
    that.props.scope.$apply(function () {
      that.props.scope.openSelectedModels();
    });
  },
  createModelsFromDS: function(options) {
    var that = this;
    var x = options;
  },
  deleteSelectedDataSource: function(key, opt) {
    var scope = this.props.scope;
    console.log('key: ' + key);
    console.log('opt' + opt);
    try{
      if (opt.sourceEvent.currentTarget.attributes['data-id']){
        var dsId = opt.sourceEvent.currentTarget.attributes['data-id'].value;
        scope.$apply(function(){
          scope.deleteDataSourceDefinitionRequest(dsId);
        });
      }
    }
    catch(error) {
      console.warn('error deleting model definition: ' + error);
    }

  },
  componentDidMount:function(){
    var menuItems = {};
    var that = this;
    var currentDSName = null;

    var isDiscoverable = false;

    menuItems.openSelectedModels = {name: "open", callback: this.openSelectedDataSources};
// Dormant for initial releast
//    menuItems.createModelsFromDS = {
//      name: "create models",
//      disabled: function(key, opt) {
//        if (opt.sourceEvent.target.attributes['data-is-discoverable']) {
//          isDiscoverable = opt.sourceEvent.target.attributes['data-is-discoverable'].value;
//        }
//        else if (opt.sourceEvent.target.parentElement.attributes['data-name']){
//          isDiscoverable = opt.sourceEvent.target.parentElement.attributes['data-is-discoverable'].value;
//        }
//        if (isDiscoverable === 'true') {
//          return false;
//        }
//        return true;
//      },
//      callback: function(key, opt) {
////        console.log('||  ' + opt.sourceEvent.target.attributes['data-name'].value);
//        var dsId = '';
//        if (opt.sourceEvent.target.attributes['data-id']) {
//          dsId = opt.sourceEvent.target.attributes['data-id'].value;
//        }
//        // check the parent element
//        else if (opt.sourceEvent.target.parentElement.attributes['data-id']){
//          dsId = opt.sourceEvent.target.parentElement.attributes['data-id'].value;
//        }
//        if (dsId){
//          that.props.scope.$apply(function () {
//
//            that.props.scope.createModelsFromDS(dsId);
//          });
//        }
//
//      }
//    };
    menuItems.deleteSelectedDataSource = {name: "delete", callback: this.deleteSelectedDataSource};

    $.contextMenu({
      // define which elements trigger this menu
      selector: '.datasource-node',
      // define the elements of the menu
      items: menuItems,
      events: {
        show: function(opt, event) {
          if (opt.sourceEvent.target.attributes['data-name']){
            currentDSName = opt.sourceEvent.target.attributes['data-name'].value;
          }


        }
      }
      // there's more, have a look at the demos and docs...
    });
  },
  render: function() {
    var scope = this.props.scope;

    var cx = React.addons.classSet;

    var clickBranch = function(event) {
      if (event.target.attributes['data-name']){
        scope.$apply(function () {
     //     scope.navTreeBranchClicked('datasource');
        });
      }
    };
    var singleClickItem = function(event) {

      if (event.target.attributes['data-id'] || event.target.parentElement.attributes['data-id']){
        var val = '';
        if (event.target.attributes['data-id']) {
          val = event.target.attributes['data-id'].value;
        }
        else {
          val = event.target.parentElement.attributes['data-id'].value;
        }
        scope.$apply(function () {
          scope.navTreeItemClicked('datasource', val, event.metaKey);
        });

      }

    };

    var addNewInstanceRequest = function(event) {
      if (event.target.attributes['data-type'] || event.target.parentElement.attributes['data-type']){
        var val = '';
        if (event.target.attributes['data-type']) {
          val = event.target.attributes['data-type'].value;
        }
        else {
          val = event.target.parentElement.attributes['data-type'].value;
        }
        scope.$apply(function() {
          scope.createDatasourceViewRequest();
        });
      }
    };

    // Datasource menu items
    var datasourceItemRenderer = function(item) {

      var isDiscoverable = false;
      if (item.isDiscoverable) {
        isDiscoverable = item.isDiscoverable;
      }
      var classNameVar = 'datasource-node';
      if (item.isActive) {
        classNameVar += ' is-active';
      }
      else if (item.isOpen) {
        classNameVar += ' is-open';
      }
      else if (item.isSelected) {
        classNameVar += ' is-selected'
      }
      return (
        <li key={item.name} data-id={item.id} className={classNameVar}>
          <button data-is-discoverable={isDiscoverable} onClick={singleClickItem} data-name={item.name} data-id={item.id} className="btn btn-default btn-block nav-tree-item tree-node"><span data-is-discoverable={isDiscoverable}  data-name={item.name} className="glyphicon glyphicon-file"></span>{item.name}</button>
        </li>);
    };
    // Main return
    return (
      <div>
        <button onClick={clickBranch} type="button" data-name="datasources_root" className="btn btn-default btn-block nav-tree-item tree-branch" title="Datasources"><span className="glyphicon glyphicon-folder-open"></span>Datasources</button>
        <ul className="branch-leaf-list is-open">{scope.mainNavDatasources.map(datasourceItemRenderer)}</ul>
        <button onClick={addNewInstanceRequest} data-type="datasource" className="nav-tree-item-addnew"><span className="plus">+</span>Add New Datasource</button>
      </div>
      );
  }
});
/*
*
* Main Controls
*
* */
var IAMainControls = (IAMainControls = React).createClass({
  getInitialState: function() {
    return {
      showNewModel: false,
      newModelText: 'new model'
    };
  },
  componentDidMount: function() {
    window.setUI();
  },
  render: function() {
    var that = this;
    var scope = that.props.scope;

    var createModelViewRequest = function() {

      scope.$apply(function() {
        scope.createModelViewRequest();
      });

    };
    var addNewInstanceRequest = function(event) {
      if (event.target.attributes['data-type'] || event.target.parentElement.attributes['data-type']){
        var val = '';
        if (event.target.attributes['data-type']) {
          val = event.target.attributes['data-type'].value;
        }
        else {
          val = event.target.parentElement.attributes['data-type'].value;
        }
        scope.$apply(function() {
          scope.createDatasourceViewRequest();
        });
      }
    };

    var renderAppViewRequest = function() {
      window.open(
        '/#demo',
        '_blank'
      );

    };
    var showExplorerViewRequest = function() {
      scope.$apply(function() {
        scope.showExplorerViewRequest();
      });
    };
    return (
      <div data-id="IAMainControlsContainer">
        <div className="main-controls-title">Create</div>


        <div className="main-controls-container">

        <div data-ui-type="table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <label className="main-control-command-label">MODEL</label>
              <button onClick={createModelViewRequest} type="button" className="btn btn-sm btn-primary">
                <span className="glyphicon glyphicon-plus-sign"></span>
                New
              </button>
            </div>
            <div data-ui-type="cell">
              <label className="main-control-command-label">APP</label>
              <button disabled="disabled" onClick={renderAppViewRequest} type="button" className="btn btn-primary btn-sm">
                <span className="glyphicon glyphicon-plus-sign"></span>
                Render
              </button>
            </div>
          </div>
        </div>


        <label className="main-control-command-label">DATASOURCE</label>
        <div data-ui-type="table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                data-name="oracle"
                className="btn btn-default btn-control-ds"
                title="oracle connector">
                  <span className="glyphicon glyphicon-cloud"></span>
              </button>
              <div className="ds-type-name">Oracle</div>
            </div>
            <div data-ui-type="cell">
              <button className="btn btn-default btn-control-ds"
                data-type="datasource"
                data-name="mssql"
                onClick={addNewInstanceRequest}
                title="mssql connector">
                  <span className="glyphicon glyphicon-cloud"></span>
              </button>
              <div className="ds-type-name">MsSQL</div>
            </div>
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                className="btn btn-default btn-control-ds"
                data-name="mysql"
                title="mysql connector">
                  <span className="glyphicon glyphicon-cloud"></span>
              </button>
              <div className="ds-type-name">MySQL</div>
            </div>
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                className="btn btn-default btn-control-ds"
                data-name="postgres"
                title="postgres connector">
                  <span className="glyphicon glyphicon-cloud"></span>
              </button>
              <div className="ds-type-name">Postgres</div>
            </div>
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                className="btn btn-default btn-control-ds"
                data-name="mongo"
                title="mongodb connector">
                  <span className="glyphicon glyphicon-cloud"></span>
              </button>
              <div className="ds-type-name">Mongo</div>
            </div>
          </div>
        </div>

        </div>

      </div>
      );
  }
});

