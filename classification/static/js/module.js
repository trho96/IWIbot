function w3_open(event) {
    var target = event.currentTarget || event.target;
    var sidebar = "sidebar-left";

    if (!(target.id == "openNav-left")) {
        sidebar = "sidebar-right";
    }

    document.getElementById(sidebar).style.width = "25%";
    document.getElementById(sidebar).style.display = "block";
    $('#message').focus();
}
function w3_close(event) {
    var target = event.currentTarget || event.target;
    var main = "main";
    var sidebar = "sidebar-left";
    var openNav = "openNav-left";

    if (target.id == "closeNav-right") {
        sidebar = "sidebar-right";
        openNav = "openNav-right";
    }

    document.getElementById(sidebar).style.display = "none";
}

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// Warn if overriding existing method
if(Array.prototype.contains)
    console.warn("Overriding existing Array.prototype.contains. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
if(Array.prototype.unique)
    console.warn("Overriding existing Array.prototype.unique. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

// attach the .contains method to Array's prototype to call it on any array
Array.prototype.contains = function (element) {
    // if the other array is a falsy value, return
    if (!element)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] == element) {
            return true;
        }
    }
    return false;
};
// attach the .unique method to Array's prototype to call it on any array
Array.prototype.unique = function () {
    var unique_array = this.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    });
    return unique_array
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
Object.defineProperty(Array.prototype, "contains", {enumerable: false});
Object.defineProperty(Array.prototype, "unique", {enumerable: false});