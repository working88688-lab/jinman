define(['jquery', 'zui'], function ($) {
    const selector = '.pager';
  
    function init_pager(el) {
      const base_url = $(el).data('href');
      if (base_url) {
        const url = decodeURIComponent(`${location.origin}${location.pathname}`);
        const maybe_page_string = url.replace(new RegExp(base_url), '');
  
        let current_page = 1;
        if (maybe_page_string) {
          current_page = maybe_page_string.split('/').filter((item) => item)[0];
        }
        $(el).pager({
          page: Number(current_page || 1),
          linkCreator: function linkCreator(page) {
            return `${base_url}/${page}`;
          },
          onPageChange: function onPageChange(state, oldState) {
            if (state.page !== oldState.page) {
              window.location.href = `${base_url}/${state.page}`;
            }
          },
        });
      }
    }
  
    init_pager(selector);
  
    return {
      init_pager,
    };
  });
  