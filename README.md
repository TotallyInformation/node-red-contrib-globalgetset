# node-red-contrib-globalgetset
[Node-Red](http://nodered.org) Node that sets/gets a context.global variable. This saves you having to use a function node with JavaScript.

You can easily pass in a msg containing an element to store in the global variables. In this case, assuming there are no errors, the msg will
be passed through unchanged.

You can also use the node to retrieve something from the global variables and add it to the msg (or indeed to another global variable). This allows
you to then process it it downstream. For example, the following node could be a ```switch``` node that could switch output depending on the variable.

## Note
It is likely that future updates to Node-Red will integrate this type of feature.

#Install

Run the following command in the root directory of your Node-RED install

	npm install node-red-contrib-globalgetset

While in development, install with:
   
    npm install https://github.com/TotallyInformation/node-red-contrib-globalgetset/tarball/master

#Usage

The node expects an input from the incoming msg. By default, this is msg.payload. If it is a recognisable date/time, it will apply a format and output the resulting string or
object accordingly.

There are 7 parameters to the node. Note that the first 3 refer to the global variable, the next 2 refer to the source/target variable.

1. *Get or Set* - Get will get a value from the global variables, set will create/update a global variable.
2. *Context* - Currently only allows global (for future improvements).
3. *Variable* - the name of the global variable to get/set. Note that to use this variable in a function node, you would use ```context.global.<Variable>```.
4. *msg/global* - Whether the source/target variable is a global one or an element in ```msg```.
5. *source/target* - For GET, this is the target of the data being taken *from* the global variable. for SET, this is the source of the data being given to the global variable.
   4 & 5 are catenated to make, for example, ```msg.payload``` (the default) or ```context.global.temporary```
   
6. *topic* - Optional. Change the topic for the outbound msg.
7. *name* - Optional. Standard Node-Red name field.

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