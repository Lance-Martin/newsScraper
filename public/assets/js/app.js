$(document).ready(function(){
  var articleList = [];
  $.getJSON('/articles', function(data) {
    // for each one
    for (var i = 0; i<data.length; i++){
      articleList.push(data[i]);
    }
    var firstStory = articleList.length - 1;
    var currentID = articleList[firstStory]._id;
    function populate() {
      $("#storyHeadline").text(articleList[firstStory].title);
      $('#summary').text(articleList[firstStory].summary);
      $('#storyLink').attr('href', articleList[firstStory].link);
    }
    populate();
    function getComment() {
      $.ajax({
        method: "GET",
        url: "/articles/" + currentID,
      }).done(function(data) {
        console.log(data);
        // if there's a note in the article
        if(data.comments){
          console.log('should have input the comment');
          // place the title of the note in the title input
          $('.comments').html('<p>'+data.comments.body+'</p>');
        }
        else {
          console.log("there isn't a comment");
          $('.comments').html("<p>There aren't any comments for this story yet. Care to add one?</p>");
        }
      });
    }
    getComment();
    $('#next').on('click',function(){
      $('#news').shake({
        times: 1
      });
      if (firstStory > 0) {
        firstStory--;
        currentID = articleList[firstStory]._id;
        populate();
        getComment();
      }
      else {
        firstStory = articleList.length-1;
        currentID = articleList[firstStory]._id;
        populate();
        getComment();
      }
    });
    $('#previous').on('click',function(){
      $('#news').shake({
        times: 1
      });
      if (firstStory < articleList.length - 1){
        firstStory++;
        currentID = articleList[firstStory]._id;
        populate();
        getComment();
      }
      else {
        firstStory = 0;
        currentID = articleList[firstStory]._id;
        populate();
        getComment();
      }
    });
    $('#postNote').on('click',function(){
      var currentID = articleList[firstStory]._id;
      console.log("clicked");
      $.ajax({
         method: "POST",
         url: "/articles/" + currentID,
         data: {
           body: $('#commentAdded').val() // value taken from notetextarea
         }
       }).done(function( data ) {
         console.log(data);
         console.log(data._id);
         console.log(articleList[firstStory]);
         articleList[firstStory].comments = {};
         articleList[firstStory].comments._id = data._id;
         $('#commentAdded').val('');
         getComment();
         });

    });

    $('#removeNote').on('click',function(){
      var currentID = articleList[firstStory]._id;
      var commentID = articleList[firstStory].comments;
      console.log(commentID);
      $.ajax({
         method: "POST",
         url: "/delete/" + currentID,
         data: {
           currentID: currentID,
           commentID: commentID
         }
       }).done(function( data ) {
         console.log(data);
         getComment();
         });
    });

    $('#scrape').on('click', function(){
      $.ajax({
        method: "GET",
        url: '/scrape'
      }).done(function(data){
        if (data == 'alreadyFresh') {
          sweetAlert("Oops...", "Someone already added the lastest article!", "error");
        }
        else {
          window.location.reload();
        }
      });
    });
  });
  console.log(articleList);

});
