$(function() {
    var files = [],
        imagesFolder,
        thumbnails = $('#thumbnails'),
        preview = $('.preview'),
        scrollBall = $('#scrollBall'),
        scroll = $('#scroll'),
        maxThumbnailsX,
        maxBallX = scroll.width() - scrollBall.width();

    function getAspectRatio(img) {
        return img.width / img.height;
    }

    function calcThumbnailWidth(height, aspectRatio) {
        return (height * aspectRatio).toFixed(0);
    }

    function showImagePreview() {
        var thumbnail = $(this);
        thumbnail.clone().css({
            'z-index' : 100,
            'position' : 'absolute',
            'left' : thumbnail.offset().left,
            'top' : thumbnail.offset().top

        }).prependTo('body').animate({
            'width' : preview.width(),
            'height' : preview.height(),
            'left' : preview.offset().left + 5,
            'top' : preview.offset().top + 5
        }, 400, function() {
            $(this).addClass('preview')
                .removeAttr( 'style' )
                .css('visibility', 'visible');
            preview.remove();
            preview = $(this);
        });
    }

    function loadThumbnail(idx, callback) {
        $('<img>').attr('src', imagesFolder + '/' + files[idx]).hide()
            .load(function() {
                var thumbnail = $(this),
                    aspect = getAspectRatio(thumbnail.get(0)),
                    height = thumbnails.height();
                thumbnail.css({
                    'height': height,
                    'width' : calcThumbnailWidth(height, aspect)
                });
                thumbnails.css('width', thumbnails.width() + thumbnail.width() + 6);
                thumbnails.append(thumbnail);
                thumbnail.fadeIn(callback);
                thumbnail.click(showImagePreview);
                if (idx === 0) {
                    preview.attr('src', thumbnail.attr('src'))
                        .load(function() {
                            preview.css('visibility', 'visible');
                        });
                }
                if (idx === files.length - 1) {
                    maxThumbnailsX = thumbnails.width() - $(window).width();
                    scroll.css('visibility', 'visible');
                }
            });
    }

    function loadThumbnails() {
        var idx = 0,
            load = function() {
                if (idx < files.length) {
                    loadThumbnail(idx++, load)
                }
            };
        load();
    }

    $(window).resize(function () {
        var height = thumbnails.height();
        thumbnails.css('width', 0);
        $('img', thumbnails).each(function() {
            var aspect = getAspectRatio(this);
            $(this).css({
                'height': height,
                'width' : calcThumbnailWidth(height, aspect)
            });
            thumbnails.css('width', thumbnails.width() + $(this).width() + 6);
        });
        maxBallX = scroll.width() - scrollBall.width();
        maxThumbnailsX = thumbnails.width() - $(window).width();
    });

    scrollBall.draggable({
        axis: "x" ,
        containment: "parent",
        scroll: false
    }).on('drag' ,function(event, ui) {
        var currThumbnailsX = (ui.position.left * maxThumbnailsX / maxBallX).toFixed(0);
        thumbnails.css('left', - currThumbnailsX);
    });

    $.getJSON('getFiles.php', function(data) {
        imagesFolder = data['folder'];
        files = data['files'].slice(2);
        console.log(files);
       loadThumbnails();
    });
});