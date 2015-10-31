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

// Node for Node-Red that reads from either a context.global or msg var and
// outputs to either a context.global or msg var

module.exports = function(RED) {
    "use strict";
    
    // The main node definition - most things happen in here
    function GlobalGetSet(n) {
        // Create a RED node
        RED.nodes.createNode(this,n);
        
        // Store local copies of the node configuration (as defined in the .html)
        this.name = n.name;
        this.topic = n.topic;
        this.context = n.context;
        this.variable = n.variable;
        this.outContext = n.outContext;
        this.outVar = n.outVar;

        // copy "this" object in case we need it in context of callbacks of other functions.
        var node = this;
        
        // respond to inputs....
        node.on('input', function (msg) {
			// Make sure the node form variables exist as they are not all required
			if ( ! 'name' in node) { node['name'] = ''; }
			if ( ! 'topic' in node) { node['topic'] = ''; }
			if ( ! 'context' in node) { node['context'] = ''; }
			if ( ! 'variable' in node) { node['variable'] = ''; }
			if ( ! 'outContext' in node) { node['outContext'] = ''; }
			if ( ! 'outVar' in node) { node['outVar'] = ''; }

            // Check the input context variable
            if ( node.context === '' ) {
                node.context = 'global';
                node.warn('Context field is REQUIRED, currently blank, set to "global".');
            } else {
	            if ( (node.context !== 'global') && (node.context !== 'msg') && (node.context !== 'context') ) {
					node.context = 'global';
					node.warn('Context field must be either "global", "msg" or "context, set to "global".');
				}
			}
			
            // Check the input variable name 
			// If blank, try to use the input topic, if that isn't available, set to "temporary" and warn
            if ( node.variable === '' ) {
				if ( ( 'topic' in msg ) && msg.topic !== '' ) {
					node.variable = msg.topic;
					//node.warn('Variable name field is REQUIRED, currently blank, set to input msg topic.');
				} else {
					node.variable = 'temporary';
					node.warn('Variable name field is REQUIRED, currently blank, topic also blank, set to "temporary".');
				}
            }
            
            // Check the output (on Get, input on Set) context variable
            if ( node.outContext === '' ) {
                node.outContext = 'global';
                node.warn('outContext field is REQUIRED, currently blank, set to "global".');
            } else {
	            if ( (node.outContext !== 'global') && (node.outContext !== 'msg') && (node.outContext !== 'context') ) {
					node.outContext = 'global';
					node.warn('outContext field must be either "global", "msg" or "context, set to "global".');
				}
			}
			
            // Check the outVar/target variable (Output on Get, Input on Set)
			// If blank, try to use the input topic, if that isn't available, set to "payload" and warn
            if ( node.outVar === '' ) {
				if ( ( 'topic' in msg ) && msg.topic !== '' ) {
					node.outVar = msg.topic;
					//node.warn('outVar/Target name field is REQUIRED, currently blank, set to input msg topic.');
				} else {
					node.outVar = 'payload';
                	node.warn('outVar/Target name field is REQUIRED, currently blank, topic also blank, set to "payload".');
				}
            }

			// Process
			
			// Create reference to the internal global variables
			// WARNING: This will change when context and global are made more widely available (possibly in NR v0.12) TODO
			var myGlobal = RED.settings.functionGlobalContext;
			// Create text string for input (used in eval's below) TODO: Add option for context
			// NB: bracketed notation is safer in case an odd variable name is passed (e.g. with / or space)
			var myOutput = (node.outContext === 'global' ? 'myGlobal' : 'msg') + '["' + node.outVar + '"]';
			/*
			console.log('CONTEXT: ' + node.context + '<<');
			console.log('GETSET: ' + node.getset + '<<');
			console.log('VARIABLE: ' + node.variable + '<<');
			console.log(myGlobal.temporary);
			console.log('outVar: ' + node.outVar + '<<');
			console.log('OUTCONTEXT: ' + node.outContext + '<<');
			console.log('myOutput: ' + myOutput + '<<');
			console.log('GET: ' + myOutput + ' = myGlobal["' + node.variable + '"];');
			console.log('SET: ' + 'myGlobal["' + node.variable + '"] = ' + myOutput + ';');
			*/
			//NB: Yes, we are using EVAL here! It isn't evil, just misunderstood.
			//	  This is an appropriate use case for eval (handling dynamic variables in function scope).
			//	  Just ensure input is safe!
			
			// shall we process the request? Use to ensure we don't send a msg if there are problems
			var doProcess = true;
			
			if ( node.context === "global" ) {
				// check that the requested global var actually exists
				if ( node.variable in myGlobal ) {
					// it does so set the target to its value
					eval( myOutput + ' = myGlobal["' + node.variable + '"];' );
				} else {
					// it doesn't exist so fail with error
					//console.dir(RED.settings.functionGlobalContext);
					node.error("Variable '" + node.variable + "' does not exist in 'context.global' - msg not sent");
					doProcess = false;
				}
			} else if ( node.context === "msg" ) {
				// check that the requested msg var actually exists
				if ( node.variable in msg ) {
					// it does so set the target to its value
					eval( myOutput + ' = msg["' + node.variable + '"];' );
				} else {
					// it doesn't exist so fail with error
					//console.dir(RED.settings.functionGlobalContext);
					node.error("Variable '" + node.variable + "' does not exist in 'msg' - msg not sent");
					doProcess = false;
				}					
			} else { // context - TODO
				node.warn('Getting from context is not yet available - msg not sent');
				doProcess = false;
			}				

			// send on the msg only if required (we don't send if there was an error)
			if ( doProcess ) {
				// If the node's topic is set, copy to output msg
				if ( node.topic !== '' && ('topic' in msg) ) {
					msg.topic = node.topic;
				} // If nodes topic is blank, use the input msg.topic
            
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
};
