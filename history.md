# Update History for node-red-contrib-global

## 2015-10-31 v2.0.0

Realised that get/set was unnecessary once both input and output allowed msg as well as context.global. So simplified the code ... a lot!

Also improved & simplified the layout of the node and the help information.

Potentially breaking change so bumped the version to v2

WARNING: You may need to reset some of the settings in your node instances, please check that they are all what you expect.

## 2015-10-31 v1.0.1

Allow variable name to be set from the incoming msg.topic.

Allow new context of "msg" which will take the information from (get) to output to (set) the msg object instead of a global variable.

Simplify input tips - making them change on selection change.

Added this history file.


## 2015-05-25 v1.0.0

Initial release.