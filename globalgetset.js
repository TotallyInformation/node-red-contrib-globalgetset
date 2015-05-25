/*jslint devel: true, node: true, indent: 4*/
/**
* Copyright (c) 2015 Julian Knight (Totally Information)
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

// Node for Node-Red that outputs a nicely formatted string from a date/time
// object or string using the moment.js library.

module.exports = function(RED) {
    "use strict";
    
    // The main node definition - most things happen in here
    function GlobalGetSet(n) {
        // Create a RED node
        RED.nodes.createNode(this,n);
        
        // Store local copies of the node configuration (as defined in the .html)
        this.topic = n.topic;
        this.variable = n.variable;
        this.source = n.source;
        this.sourcepref = n.sourcepref;
        this.getset = n.getset;
        this.context = n.context;

        // copy "this" object in case we need it in context of callbacks of other functions.
        var node = this;
        
        // send out the message to the rest of the workspace.
        // ... this message will get sent at startup so you may not see it in a debug node.
        // Define OUTPUT msg...        
        //var msg = {};
        //msg.topic = this.topic;
        //msg.payload = "Hello world !"
        //node.send(msg);
		        
        // respond to inputs....
        node.on('input', function (msg) {
            // If the node's topic is set, copy to output msg
            if ( node.topic !== '' ) {
                msg.topic = node.topic;
            } // If nodes topic is blank, the input msg.topic is already there
            
            // Check the context/context.global variabel name
            if ( node.variable === '' ) {
                node.variable = 'temporary';
                node.warn('Variable name field is REQUIRED, currently blank, set to "temporary".');
            }
            
            // Check the source/target variable
            if ( node.source === '' ) {
                node.source = 'msg.payload';
                node.warn('Source/Target name field is REQUIRED, currently blank, set to "msg.payload".');
            }

            // Check the get/set variable
            if ( node.getset === '' ) {
                node.getset = 'get';
                node.warn('Get/Set field is REQUIRED, currently blank, set to "get".');
			} else {
	            if ( (node.getset !== 'get') && (node.getset !== 'set') ) {
					node.getset = 'get';
					node.warn('Get/Set field must be either "get" or "set, set to "get".');
				}
            }

            // Check the get/set variable
            if ( node.context === '' ) {
                node.context = 'global';
                node.warn('Context field is REQUIRED, currently blank, set to "global".');
            } else {
	            if ( (node.context !== 'global') && (node.context !== 'context') ) {
					node.context = 'global';
					node.warn('Context field must be either "global" or "context, set to "global".');
				}
			}
			
			// Process
			// TODO: Add more input checks (e.g. node.source must start with msg or context)
			var myGlobal = RED.settings.functionGlobalContext;
			// NB: bracketed notation is safer in case an odd variable name is passed (e.g. with / or space)
			var mySource = (node.sourcepref === 'global' ? 'myGlobal' : 'msg') + '["' + node.source + '"]';
			/*
			console.log('CONTEXT: ' + node.context + '<<');
			console.log('GETSET: ' + node.getset + '<<');
			console.log('VARIABLE: ' + node.variable + '<<');
			console.log(myGlobal.temporary);
			console.log('SOURCE: ' + node.source + '<<');
			console.log('SOURCEPREF: ' + node.sourcepref + '<<');
			console.log('MYSOURCE: ' + mySource + '<<');
			console.log('GET: ' + mySource + ' = myGlobal["' + node.variable + '"];');
			console.log('SET: ' + 'myGlobal["' + node.variable + '"] = ' + mySource + ';');
			*/
			//NB: Yes, we are using EVAL here! It isn't evil, just misunderstood.
			//	  This is an appropriate use case for eval (handling dynamic variables in function scope).
			//	  Just ensure input is safe!
			
			var doProcess = false; // shall we process the request?
			if ( node.getset === "set" ) {
				// Check if source exists, if not, warn and exit
				if ( node.sourcepref === 'global' ) {
					if ( node.source in myGlobal ) {
						// found it so process
						doProcess = true;
					}
				} else { // msg
					if ( node.source in msg ) {
						// found it so process
						doProcess = true;
					}					
				}
				if ( doProcess ) {
					if ( node.context === "global" ) {
						eval( 'myGlobal["' + node.variable + '"] = ' + mySource + ';' );
					} else {
						// TODO: Can we access context from a node? - Look at the FUNCTION node!!
						node.warn('Setting context is not yet available');
						doProcess = false;
						/*
						eval( 'RED.settings[' + node.variable + '] = ' + node.source + ';' );
						*/
					}
				} else {
					// we didn't find the source so warn and exit
					node.error('Source not found, not processing & msg not sent');
				}
			} else { // get
				doProcess = true;
				// TODO: Can we get a list of existing vars on edit?
				if ( node.context === "global" ) {
					// check that the requested global var actually exists
					if ( node.variable in myGlobal ) {
						// it does so set the target to its value
						eval( mySource + ' = myGlobal["' + node.variable + '"];' );
					} else {
						// it doesn't exist so fail with error
						//console.dir(RED.settings.functionGlobalContext);
						node.error(node.variable + " does not exist in context.global");
						doProcess = false;
					}
				} else { // context - TODO
					node.warn('Getting from context is not yet available');
					doProcess = false;
					/*
					if ( node.variable in myGlobal ) {
						eval( node.source + ' = myGlobal["' + node.variable + '"];' );
					} else {
						node.error(node.variable + " does not exist in context");
					}
					*/
				}				
			}

			// send on the msg only if required (we don't send if there was an error)
			if ( doProcess ) {
				node.send(msg);
			}
        });
        
        // Tidy up if we need to
        //node.on("close", function() {
            // Called when the node is shutdown - eg on redeploy.
            // Allows ports to be closed, connections dropped etc.
            // eg: node.client.disconnect();
        //});
    }
    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType("globalGetSet",GlobalGetSet);
}
