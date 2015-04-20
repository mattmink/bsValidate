$(function(){
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

  // Custom Messages
  $('#customMessagesForm').bsValidate({
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
          alert: "You are required to enter your email."
        }
      }
    },
    success: function(e){
      e.preventDefault();
      alert('Success!');
    }
  });
});