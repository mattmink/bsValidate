# Bootstrap Form Validation with jQuery
bsValidate is a lightweight jQuery Plugin that provides basic validation of Twitter Bootstrap (v3) forms. Current validation capabilities include:
+ Required fields
+ Email formatting
+ Character limit

I plan to build on this list and offer more validation options in the future, so stay tuned!

## Prerequisites
### JS
+ jQuery (minimum version requirement pending...)
### CSS
+ Bootstrap (not a requirement if you plan to include your own styles that use the same classes)

## Installation
After your reference to jQuery, add a reference to the `jquery.bsvalidate.min.js` file within your project:
```html
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
  <script src="/path/to/js/jquery.bsvalidate.min.js"></script>
```

## Basic Use
The basic use of the plugin is intended to enforce required fields only. Required fields are indidcated with the `.required` class, or the `[required]` attribute. 

HTML
```html
<form id="theForm">
  <!-- Fields need to be wrapped in a .field-group to ensure proper display of error messages -->
    <div class="form-group">
      <!-- A label should be included, either with the <label> tag or an element given the .label class -->
        <label class="control-label">Name</label>
        <!-- This field will be required, because it uses the .required class -->
        <input type="text" name="name" class="form-control required" />
    </div>
    <div class="form-group">
        <label class="control-label">Email</label>
        <!-- This field will also be required, because it uses the [required] attribute -->
        <input type="text" name="email" class="form-control" required />
    </div>
    <div class="form-group">
        <label class="control-label">Message</label>
        <!-- No validation will be applied to this field -->
        <textarea name="message" class="form-control" rows="8"></textarea>
    </div>
    <div class="form-group">
        <input type="submit" class="btn btn-primary" value="Submit" />
    </div>
</form>
```
JavaScript
```javascript
$('#theForm').bsValidate();
```

_**Note:** using the `[required]` attribute to indicate a field as being required could cause the browser's validation to override the behavior of the plugin. if this occurs, add the `.required` class to the element instead_

## Advanced Use
Alternatively, a `fields` object can be specified in place of (or in addition to) element attributes to list the fields that should be validated, along with the validation requirements. The `[name]` attribute is used as the key name for each field.

HTML
```html
<form id="theForm">
    <div class="form-group">
        <label class="control-label">Name</label>
        <input type="text" name="name" class="form-control" />
    </div>
    <div class="form-group">
        <label class="control-label">Email</label>
        <input type="text" name="email" class="form-control" />
    </div>
    <div class="form-group">
        <label class="control-label">Message</label>
        <textarea name="message" class="form-control" rows="8"></textarea>
    </div>
    <div class="form-group">
        <input type="submit" class="btn btn-primary" value="Submit" />
    </div>
</form>
```
JavaScript
```javascript
/*
 *  This has the same effect as the basic example,
 *  except custom messages have been included.
 */
$('#theForm').bsValidate({
  fields: {
      name: {
          required: {
              helpText: "Please enter your name.",
                alert: "Oops! You forgot to tell us your name. Please enter it below."
            }
        },
        email: {
          required: {
              helpText: "Please enter your email.",
                alert: "We hate to pry, but could we get your email address please? We'll need one to write back."
            }
        }
    }
});
```
## Available Options
```javascript
{
  // A list of fields, using the [name] attributes as key names (see example above). Each indicated field 
    // should include the necessary validation options (see below).
    // DEFAULT: {} (OBJECT)
  fields: {},
    // The DOM element into which the alerts should be prepended when validation errors occur.
    // DEFAULT: this (JQUERY OBJECT => the form to which the bsValidate function is attached)
    alertTarget: $(element),
    // A jQuery selector used to determine which fields should be required.
    // DEFAULT: "input.required:not(:checkbox),textarea.required,select.required,[required]" (STRING)
    requiredSelector: "",
  // For <select> fields, change what the plugin considers as "blank" (i.e. "-- Select --")
    // DEFAULT: "" (STRING)
  blankSelectValue: "",
    // Callback function that fires after all fields pass validation, but before the form submits.
    // In case you want to submit your form with JavaScript (Ajax) or run more JavaScript before submitting,
    // an event parameter is passed to the function, and event.preventDefault() can be used.
    // DEFAULT: function(e){} (FUNCTION)
  success: function(e){},
    // Callback function that fires if one or more fields fail validation. By default, the form is prevented
    // from submitting.
    // DEFAULT: function(e){ e.preventDefault(); } (FUNCTION)
  fail: function(e){}
}
```
#### Validation options
```javascript
{
  // Require the field
  required: {
    helpText: "Custom required help text.",
    alert: "Custom alert for required field."
  },
    // Make sure it looks like an email address
    email: {
    helpText: "Custom email address help text.",
    alert: "Custom alert for an email address field."
  },
    // Limit the number of characters
  characters: {
    limit: 140,
    helpText: "Custom character limit help text.",
    alert: "Custom alert for a field with a character limit (probably a <textarea> field)."
  }
}
```
