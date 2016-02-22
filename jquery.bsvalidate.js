/*!
 * jQuery bsValidate Plugin v0.7.2
 * Form Validation for Twitter Bootstrap Forms (https://github.com/matthewjmink/bsValidate)
 * Copyright 2016 Matt Mink
 * Licensed under MIT (https://github.com/matthewjmink/bsValidate/blob/master/LICENSE)
 */

;(function ( $, window, document, undefined ) {

    "use strict";

    var bsValidate = "bsValidate",

    defaults = {
        requiredSelector: "input.required,textarea.required,select.required,[required]",
        fields: {},
        mergeAlerts: false,
        alertMessage: null,
        blankSelectValue: "",
        novalidate: true,
        before: function(){},
        success: function(){},
        fail: function(e){e.preventDefault();}
    };

    $.extend(Plugin.prototype, {

        init: function () {
            var bsv = this;
            var form = $(bsv.element);
            var required = form.find(bsv.settings.requiredSelector);
            var fields = bsv.settings.fields;
            var novalidate = form.attr('novalidate');

            if(novalidate === undefined && bsv.settings.novalidate){
                form.attr('novalidate', '');
            }

            required.each(function(){
                var name = $(this).attr('name');
                if(fields[name] === undefined || fields[name].required === undefined){
                    var formGroup = $(this).parents('.form-group');
                    var label = formGroup.find('.label,label').text();
                    fields[name] = (fields[name] === undefined) ? {} : fields[name];
                    fields[name].el = $(this);
                    fields[name].required = {
                        alert: label + " is required."
                    };
                }
            });

            $.each( fields, function( key, value ) {
                if(typeof fields[key].el !== "object" || fields[key].el.jquery === undefined){
                    fields[key].el = form.find('[name="'+key+'"]');
                }
                if(fields[key].required && fields[key].required.dependency){
                    $.each( fields[key].required.dependency, function( depKey, depValue ) {
                        var depFields = depValue.split(',');
                        for (var i = 0; i < depFields.length; i++) {
                            if(!fields[depFields[i]]) {
                                fields[depFields[i]] = {
                                    el: form.find('[name="'+depFields[i]+'"]')
                                };
                                fields[depFields[i]].el.on('blur', {bsv:bsv, fields:fields, key:depFields[i], value:fields[depFields[i]]} , bsvFieldChange);
                            }
                            if(fields[depFields[i]].hasDependency) {
                                fields[depFields[i]].hasDependency += ',' + key;
                            } else {
                                fields[depFields[i]].hasDependency = key;
                            }
                        }
                    });
                }
                if(fields[key].el.length > 0){
                    fields[key].el.on('blur', {bsv:bsv, fields:fields, key:key, value:value} , bsvFieldChange);
                }else{
                    delete fields[key];
                }
            });

            form.submit(function(e){
                bsv.settings.before();
                var isValid = true;
                var alertMessage = (bsv.settings.mergeAlerts) ? bsv.settings.alertMessage : '';
                var isList = false;
                if(alertMessage === null){
                    alertMessage = '<ul>';
                    isList = true;
                }
                $.each( fields, function( key, value ) {
                    var styleClass;
                    var formGroup = fields[key].el.parents('.form-group');
                    var errCnt = 0;
                    var v = fields[key].el.val();
                    var styleKey = key.replace(/[^a-zA-Z\d-]/g, '-');
                    if(fields[key].required !== undefined){
                        var requiredTest = fields[key].el.isBlank(bsv);
                        styleClass = 'alert-'+styleKey+'-required';
                        requiredTest = requiredTest && isDependent(fields, key);
                        errCnt += (bsv.settings.mergeAlerts) ? requiredTest | 0 : toggleAlert(requiredTest, fields[key].required.alert, bsv.settings.alertTarget, styleClass);
                        alertMessage += (isList) ? '<li>'+fields[key].required.alert+'</li>' : '';
                    }
                    if(fields[key].email !== undefined){
                        styleClass = 'alert-'+styleKey+'-email';
                        errCnt += (bsv.settings.mergeAlerts) ? !isValidEmail(v) && !fields[key].el.isBlank(bsv) | 0 : toggleAlert(!isValidEmail(v) && !fields[key].el.isBlank(bsv), fields[key].email.alert, bsv.settings.alertTarget, styleClass);
                        alertMessage += (isList) ? '<li>'+fields[key].email.alert+'</li>' : '';
                    }
                    if(fields[key].characters !== undefined){
                        styleClass = 'alert-'+styleKey+'-characters';
                        errCnt += (bsv.settings.mergeAlerts) ? v.length > fields[key].characters.limit | 0 : toggleAlert(v.length > fields[key].characters.limit, fields[key].characters.alert, bsv.settings.alertTarget, styleClass);
                        alertMessage += (isList) ? '<li>'+fields[key].characters.alert+'</li>' : '';
                    }
                    if(fields[key].regex !== undefined){
                        styleClass = 'alert-'+styleKey+'-regex';
                        errCnt += (bsv.settings.mergeAlerts) ? !regexMatch(fields[key].regex.pattern, v) && !fields[key].el.isBlank(bsv) | 0 : toggleAlert(!regexMatch(fields[key].regex.pattern, v) && !fields[key].el.isBlank(bsv), fields[key].regex.alert, bsv.settings.alertTarget, styleClass);
                        alertMessage += (isList) ? '<li>'+fields[key].regex.alert+'</li>' : '';
                    }
                    if(fields[key].match !== undefined){
                        styleClass = 'alert-'+styleKey+'-match';
                        var matchFieldValue = form.find('[name="'+fields[key].match.field+'"]').val();
                        errCnt += (bsv.settings.mergeAlerts) ? matchFieldValue !== v && !fields[key].el.isBlank(bsv) | 0 : toggleAlert(matchFieldValue !== v && !fields[key].el.isBlank(bsv), fields[key].match.alert, bsv.settings.alertTarget, styleClass);
                        alertMessage += (isList) ? '<li>'+fields[key].regex.alert+'</li>' : '';
                    }
                    if(errCnt > 0){
                        formGroup.addClass('has-error');
                        isValid = false;
                    }else{
                        formGroup.removeClass('has-error');
                    }
                });
                toggleAlert(!isValid && bsv.settings.mergeAlerts, alertMessage, bsv.settings.alertTarget, 'bsv-alert');
                if(isValid){
                    bsv.settings.success(e);
                }else{
                    bsv.settings.fail(e);
                }
            });
        },
        destroy: function(callback) {
            var bsv = this;
            var fields = bsv.settings.fields;
            bsv.settings.fields = {};
            $.each( fields, function( key, field ) {
                if(typeof field.el === "object" && field.el.jquery !== undefined){
                    field.el.off('change blur', bsvFieldChange);
                }
            });
            $(bsv.element).off("submit").removeData();
            if(callback){
                callback();
            }
        }
    });

    $.fn[ bsValidate ] = function ( options ) {
        return this.each(function() {
            var el = this;
            var plugin = $.data( this, "plugin_" + bsValidate );
            if ( !plugin ) {
                $.data( this, "plugin_" + bsValidate, new Plugin( this, options ) );
            }else if(options === "destroy"){
                plugin.destroy();
            }
        });
    };

    $.fn.isBlank = function ( bsv ) {
        var val = this.val();
        if(this.is(':checkbox')){
            return !this.is(':checked');
        }
        return (val === "" || val === null || val.length < 1 || (this[0].nodeName.toLowerCase() === 'select' && val == bsv.settings.blankSelectValue));
    };

    $.fn.destroy = function ( ) {
        return this.each(function() {
            var plugin = $.data( this, "plugin_" + bsValidate );
            if ( !!plugin ) {
                plugin.destroy();
            }
        });
    };

    function Plugin ( element, options ) {
        defaults.alertTarget = $(element);
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = bsValidate;
        this.init();
    }

    function isDependent(fields, key){
        var requiredTest = true;
        if(fields[key].required.dependency){
            if(fields[key].required.dependency.isBlank){
                requiredTest = requiredTest && fieldGroupIsBlank(fields, fields[key].required.dependency.isBlank);
            }
            if(fields[key].required.dependency.isNotBlank){
                requiredTest = requiredTest && fieldGroupIsNotBlank(fields, fields[key].required.dependency.isNotBlank);
            }
        }
        return requiredTest;
    }

    function fieldGroupIsBlank(fields, dependencies){
        var blankCount = 0;
        if(typeof dependencies === 'string') {
            dependencies = dependencies.split(',');
        }
        for (var i = 0; i < dependencies.length; i++) {
            if(fields[dependencies[i]].el.isBlank()){
                blankCount++;
            }
        }
        return blankCount === dependencies.length;
    }

    function fieldGroupIsNotBlank(fields, dependencies){
        var filledCount = 0;
        if(typeof dependencies === 'string') {
            dependencies = dependencies.split(',');
        }
        for (var i = 0; i < dependencies.length; i++) {
            if(!fields[dependencies[i]].el.isBlank()){
                filledCount++;
            }
        }
        return filledCount === dependencies.length;
    }

    function toggleHelpText(test, helpText, formGroup, styleClass){
        if(test){
            if(helpText !== undefined){
                addHelpText(formGroup, helpText, styleClass);
            }
            return 1;
        }else{
            if(helpText !== undefined){
                removeHelpText(formGroup, styleClass);
            }
        }
        return 0;
    }

    function toggleAlert(test, alertText, alertTarget, styleClass){
        if(test){
            if(alertText !== undefined){
                addAlert(alertTarget, alertText, styleClass);
            }
            return 1;
        }else{
            if(alertText !== undefined){
                removeAlert(alertTarget, styleClass);
            }
        }
        return 0;
    }

    function addHelpText(formGroup, message, styleClass){
        if(formGroup.find('.'+styleClass).length < 1){
            var helpText = $('<span class="help-block '+styleClass+'">'+message+'</span>');
            formGroup.append(helpText);
        }
    }

    function removeHelpText(formGroup, styleClass){
        var helpText = formGroup.find('.'+styleClass);
        helpText.remove();
    }

    function addAlert(target, message, styleClass){
        if(target.find('.'+styleClass).length < 1){
            var alert = $('<div class="alert alert-danger ' +styleClass+ '">'+message+'</div>');
            console.log(alert);
            target.prepend(alert);
        }
    }

    function removeAlert(target, styleClass){
        var alert = target.find('.'+styleClass);
        alert.remove();
    }

    function bsvFieldChange(event){
        var data = event.data;
        var bsv = data.bsv;
        var form = $(bsv.element);
        var el = $(event.target);
        var fields = data.fields;
        var key = data.key;
        var formGroup = el.parents('.form-group');
        var errCnt = 0;
        var styleClass;
        var v = el.val();
        if(fields[key].hasDependency !== undefined){
            var depFields = fields[key].hasDependency.split(',');
            if(depFields.length > 1 || fields[depFields[0]].el[0] !== event.relatedTarget) {
                for (var i = 0; i < depFields.length; i++) {
                    var depRequiredTest = fields[depFields[i]].el.isBlank(bsv);
                    var depFormGroup = fields[depFields[i]].el.parents('.form-group');
                    styleClass = 'help-required';
                    depRequiredTest = depRequiredTest && isDependent(fields, depFields[i]);
                    var hasError = toggleHelpText(depRequiredTest, fields[depFields[i]].required.helpText, depFormGroup, styleClass);
                    if(hasError) {
                        depFormGroup.addClass('has-error');
                    } else {
                        depFormGroup.removeClass('has-error');
                    }
                }
            }
        }
        if(fields[key].required !== undefined){
            var requiredTest = fields[key].el.isBlank(bsv);
            styleClass = 'help-required';
            requiredTest = requiredTest && isDependent(fields, key);
            errCnt += toggleHelpText(requiredTest, fields[key].required.helpText, formGroup, styleClass);
        }
        if(fields[key].email !== undefined){
            styleClass = 'help-email';
            errCnt += toggleHelpText(!isValidEmail(v) && v !== "", fields[key].email.helpText, formGroup, styleClass);
        }
        if(fields[key].characters !== undefined){
            styleClass = 'help-characters';
            errCnt += toggleHelpText(v.length > fields[key].characters.limit, fields[key].characters.helpText, formGroup, styleClass);
        }
        if(fields[key].regex !== undefined){
            styleClass = 'help-regex';
            errCnt += toggleHelpText(!regexMatch(fields[key].regex.pattern, v) && !el.isBlank(bsv), fields[key].regex.helpText, formGroup, styleClass);
        }
        if(fields[key].match !== undefined){
            styleClass = 'help-match';
            var matchFieldValue = form.find('[name="'+fields[key].match.field+'"]').val();
            errCnt += toggleHelpText(matchFieldValue !== v && !el.isBlank(bsv), fields[key].match.helpText, formGroup, styleClass);
        }
        if(errCnt > 0){
            formGroup.addClass('has-error');
        }else{
            formGroup.removeClass('has-error');
        }
    }

    function regexMatch(regex, value){
        return value.match(regex);
    }

    function isValidEmail(email){
         var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
         return re.test(email);
    }

})( jQuery, window, document );
