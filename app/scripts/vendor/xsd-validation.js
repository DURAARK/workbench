define([], function() {
    // This is just a quick hack. Comprehensive XSD validation in Javascript is still very limited.
    // Maybe look into something like: https://github.com/kripken/xml.js (Emscripten port of libxml)
    
    var ns = 'http://www.w3.org/2001/XMLSchema';
    
    return {
        validate: function(type, value) {
            // Only check some basic uris from the xsd namespace
            if (type.substr(0,ns.length) !== ns) {
                return true;
            }
            type = type.substr(ns.length + 1);
            switch(type) {
                case 'int':
                case 'integer':
                    return !!parseInt(value, 10);
                break;
                case 'float':
                case 'decimal':
                    return !!parseFloat(value);
                break;
                case 'date':
                    return !!(new Date(value)).getDate();
                break;
                default: return true;
            }
        }    
    };
});