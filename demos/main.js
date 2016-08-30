$(function(){

    // Basic Example
    $('#simpleForm').bsValidate({
        success: function(e){
            e.preventDefault();
            alert('Success!');
        }
    });

    var customMessagesForm = $('#customMessagesForm');
    // Custom Messages
    customMessagesForm.bsValidate({
        fields:{
            name: {
                required: {
                    helpText: "Please enter your name.",
                    alert: "You are required to enter your name."
                }
            },
            radioGroup: {
                required: {
                    helpText: "Please select at least one",
                    alert: "You are required select at least one radio button",
                    dependency: {
                        equals: ['name', 'Billy']
                    }
                }
            },
            email: {
                required: {
                    helpText: "Please enter your email.",
                    alert: "You are required to enter your email."
                },
                email: {
                    helpText: "This doesn't look like a valid email.",
                    alert: "Please enter a valid email address."
                }
            },
            emailConfirm: {
                required: {
                    helpText: "Please confirm your email.",
                    alert: "You are required to confirm your email.",
                    dependency: {
                        isNotBlank: 'email'
                    }
                },
                match: {
                    field: "email",
                    helpText: "Oops. That doesn't match!",
                    alert: "It doesn't look like the two email addresses match."
                }
            },
            website: {
                regex: {
                    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g,
                    helpText: "This doesn't look like a real URL",
                    alert: "Please enter an actual website address."
                }
            }
        },
        before: function(){
            customMessagesForm.find('.alert').remove();
        },
        success: function(e){
            e.preventDefault();
            alert('Success!');
        }
    });

    var atLeastOneForm = $('#atLeastOneForm');
    // Custom Messages
    atLeastOneForm.bsValidate({
        fields:{
            field1: {
                required: {
                    helpText: "Please enter at least one",
                    alert: "Enter at least one field value.",
                    dependency: {
                        isBlank: 'field2,field3,field4'
                    }
                }
            },
            field2: {
                required: {
                    helpText: "Please enter at least one",
                    dependency: {
                        isBlank: 'field1,field3,field4'
                    }
                }
            },
            field3: {
                required: {
                    helpText: "Please enter at least one",
                    dependency: {
                        isBlank: 'field2,field1,field4'
                    }
                }
            },
            field4: {
                required: {
                    helpText: "Please enter at least one",
                    dependency: {
                        isBlank: 'field2,field3,field1'
                    }
                }
            },

        },
        before: function(){
            customMessagesForm.find('.alert').remove();
        },
        success: function(e){
            e.preventDefault();
            alert('Success!');
        }
    });

    var ajaxFormConfig = {
        fields:{
            name: {
                required: {
                    helpText: "Please enter your name.",
                    alert: "You are required to enter your name."
                }
            },
            email: {
                required: {
                    helpText: "Please enter your name.",
                    alert: "You are required to enter your name."
                }
            },
            message: {
                required: {
                    helpText: "Please enter your name.",
                    alert: "You are required to enter your name."
                }
            }
        },
        success: function(e){
            e.preventDefault();
            alert('Success!');
        }
    };
    initAjaxForm(ajaxFormConfig);
    $('#ajaxFieldsForm').on('click', '#loadNewFields', function(){
        console.log('new fields...');
        var fieldContainer = $('#fieldContainer');
        var html = [
            '<div class="form-group">',
                '<label class="control-label">Home Phone</label>',
                '<input type="text" name="homePhone" class="form-control" />',
            '</div>',
            '<div class="form-group">',
                '<label class="control-label">Cell Phone</label>',
                '<input type="text" name="cellPhone" class="form-control" />',
            '</div>',
            '<div class="form-group">',
                '<label class="control-label">Street Address</label>',
                '<input type="text" name="street" class="form-control" />',
            '</div>',
            '<div class="form-group">',
                '<label class="control-label">Zip Code</label>',
                '<input type="text" name="zip" class="form-control" />',
            '</div>'
        ].join('');
        fieldContainer.html(html);
        $('#ajaxFieldsForm').bsValidate('destroy');
        var updatedConfig = {
            fields:{
                cellPhone: {
                    required: {
                        helpText: "Please enter your cell phone.",
                        alert: "You are required to enter your cell phone."
                    }
                },
                street: {
                    required: {
                        helpText: "Please enter your street address.",
                        alert: "You are required to enter your street address."
                    }
                },
                zip: {
                    required: {
                        helpText: "Please enter your zip code.",
                        alert: "You are required to enter your zip code."
                    }
                }
            },
            success: function(e){
                e.preventDefault();
                alert('Success!');
            }
        };
        initAjaxForm(updatedConfig);
    });
    function initAjaxForm(config) {
        $('#ajaxFieldsForm').bsValidate(config);
    }
});
