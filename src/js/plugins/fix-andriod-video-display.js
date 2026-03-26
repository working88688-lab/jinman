define(['utils'], function (utils) {
  function fixVideoDisplay(getPlayer, autoplay = false) {
    
    if (utils.isAndroid) {
       const target = $('body').get(0)
       const search = document.querySelector('.mobile-search')
       const drawer = document.querySelector('.dx-drawer');
    
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          const target = mutation.target
          if (mutation.attributeName === 'class') {
            const classList = target.classList
            player = getPlayer()
            player.___isPaused = player.paused
            if (classList.contains('modal-open') || classList.contains('mobile-search-open') || classList.contains('dx-drawer--open')) {
              if (player) {
                player.pause()
              }
              $(".player-container video").css({
                  display: 'none'
              })
              $(".player-container .xgplayer-poster").css({
                  opacity: 1,
                  visibility: 'visible'
              })
                
            } else {
                $(".player-container video").css({
                    display: 'block'
                })
                $(".player-container .xgplayer-poster").css({
                    opacity: 0,
                    visibility: 'hidden'
                })

                if (autoplay) {
                  player.play()
                }
            }
          }
        });
      });
      observer.observe(target, {
        attributes: true, 
        attributeFilter: ['class'],
      });
       observer.observe(search, {
          attributes: true, 
          attributeFilter: ['class'],
      });
      observer.observe(drawer, {
          attributes: true, 
          attributeFilter: ['class'],
      });
    }
  }

  return fixVideoDisplay
})
