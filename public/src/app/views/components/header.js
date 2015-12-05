var React = require("react");

var Header = React.createClass({
    render: function(){
        <header>
            <a id="logo" href="/">
                Blockchain<span className="highlight">&nbsp;Realtime</span>
            </a>
            <TopNav />
        </header>        
    }
})

module.exports = Header;
