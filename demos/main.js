$(function(){
  // Fix line indenting in code snippets
  $('pre code').each(function() {
    var lines = $(this).text().split('\n');
    var indent = 2;
    var line1Indent = lines[1].match(/^\s+/);
    if(lines.length > 3){
      for(var i = 1; i < lines.length; i++){
        var lineIndent = lines[i].match(/^\s+/);
        if(lineIndent != null){
          if(lineIndent[0].length != line1Indent[0].length){
            indent = lineIndent[0].length - line1Indent[0].length;
            break;
          }
        }
      }
    }
    lines = lines.map(function(line) {
      return line.substring(line1Indent[0].length - indent, line.length);
    });
    $(this).text(lines.join('\n'));
  });

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
      email: {
        required: {
          helpText: "Please enter your email.",
          alert: "You are required to enter your email.",
          dependency: {
            isBlank: 'name'
          }
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
});
