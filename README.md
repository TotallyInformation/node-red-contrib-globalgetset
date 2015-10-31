### UPDATE v2, 2015-10-31
Note that v2 is a potentially breaking change from v1 as the underlying code has changed significantly. V2 is simpler to use and does more than v1 but
you may need to reset some parameters in your node instances.

# node-red-contrib-globalgetset

[Node-Red](http://nodered.org) Node that can get/set a context.global variable. This saves you having to use a function node with JavaScript.

You can easily pass in a msg containing an element to store in the global variables. In this case, assuming there are no errors, the msg will
be passed through unchanged.

You can also use the node to retrieve something from the global variables and add it to the msg (or indeed to another global variable). This allows
you to then process it it downstream. For example, the following node could be a ```switch``` node that could switch output depending on the variable.

Finally, you could use this node to duplicate something from the input msg to a different element on the output msg. Note however that currently, you can only
do this at the first sub-level of msg (e.g. ```msg.mything```) not any lower (e.g. ```msg.mysub.mything``` doesn't work, you would get instead 
```msg["mysub.mything"]```). Use in combination with the ```change``` node if you want anything more complex.

## Note
Future updates to Node-Red will better expose the ```context``` and ```context.global``` variables. When that happens (estimated currently at around NR v0.12)
this node will require changing to use the full features and to expose the ```context``` part that is currently disabled.

#Installation

Run the following command in the root directory of your Node-RED install

	npm install node-red-contrib-globalgetset

While in development, install with:
   
    npm install https://github.com/TotallyInformation/node-red-contrib-globalgetset/tarball/master

#Usage

The node defaults to input from the ```context.global.temporary``` and output to ```msg.payload```.

The parameters to the node are:

### Input
- *Context* - The input context (AKA prefix). Currently only allows ```global``` (meaning ```context.global```) or ```msg```.
- *Variable* - The name of the input variable.
   - Leave this blank if you want to use the *incoming* ```msg.topic``` as the variable name (note however that not all valid topic names may be valid variable names).

### Output
- *Context* - The ouput context (prefix). Currently only allows ```global``` (meaning ```context.global```) or ```msg```.
- *Variable* - The name of the ouput variable
   - Leave this blank if you want to use the *incoming* ```msg.topic``` as the variable name (note however that not all valid topic names may be valid variable names).

### Other
- *topic* - Optional. Change the topic for the outbound msg.
- *name* - Optional. Standard Node-Red name field. Names the instance of the node.

For both the input and output, *context* and *variable* are catenated to make, 
for example, ```msg.payload``` or ```context.global.temporary```, etc.

#License 

This code is Open Source under an Apache 2 License. Please see the [apache2-license.txt file](https://github.com/TotallyInformation/node-red-contrib-moment/apache2-license.txt) for details.

You may not use this code except in compliance with the License. You may obtain an original copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an 
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Please see the
License for the specific language governing permissions and limitations under the License.

# Author

[Julian Knight](https://uk.linkedin.com/in/julianknight2/) ([Totally Information](https://www.totallyinformation.com)), https://github.com/totallyinformation

#Feedback and Support

Please report any issues or suggestions via the [Github Issues list for this repository](https://github.com/TotallyInformation/node-red-contrib-globalgetset/issues).

For more information, feedback, or community support see the Node-Red Google groups forum at https://groups.google.com/forum/#!forum/node-red