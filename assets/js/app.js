$(function () {
  lucide.createIcons();

  let cartCount = 2;
  let cartTotal = 365;

  function applyLanguage(language, persist = true) {
    const isEnglish = language === 'en';
    const nextLanguage = isEnglish ? 'ar' : 'en';

    $('html').attr({
      lang: language,
      dir: isEnglish ? 'ltr' : 'rtl'
    });
    $('.language-label')
      .text(isEnglish ? 'AR' : 'EN')
      .attr('lang', nextLanguage);
    $('.language-toggle').attr('aria-label', isEnglish ? 'التبديل إلى العربية' : 'Switch to English');

    if (persist) localStorage.setItem('hirfah-language', language);
  }

  const savedLanguage = localStorage.getItem('hirfah-language');
  applyLanguage(savedLanguage === 'en' ? 'en' : 'ar', false);

  $('.language-toggle').on('click', function () {
    applyLanguage($('html').attr('lang') === 'ar' ? 'en' : 'ar');
  });

  function showToast(message) {
    $('#toast').text(message).removeClass('-translate-y-24');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => $('#toast').addClass('-translate-y-24'), 2200);
  }

  $('#menuButton').on('click', function () {
    $('#mobileMenu').stop(true, true).slideToggle(180);
  });

  $('#mobileMenu a').on('click', function () {
    $('#mobileMenu').slideUp(150);
  });

  $('#searchButton, #mobileSearchButton').on('click', function () {
    $('#searchPanel').fadeIn(160).css('display', 'block');
    setTimeout(() => $('#globalSearch').trigger('focus'), 50);
  });

  $('#closeSearch, #searchPanel').on('click', function (event) {
    if (event.target === this || this.id === 'closeSearch') $('#searchPanel').fadeOut(140);
  });

  $(document).on('keydown', function (event) {
    if (event.key === 'Escape') $('#searchPanel').fadeOut(140);
  });

  $('.filter-chip').on('click', function () {
    const filter = $(this).data('filter');
    $('.filter-chip')
      .removeClass('bg-sage text-ink border-sage font-bold')
      .addClass('border-transparent font-semibold text-muted');
    $(this)
      .addClass('bg-sage text-ink border-sage font-bold')
      .removeClass('border-transparent font-semibold text-muted');
    $('.product-grid .product-card').each(function () {
      $(this).toggle(filter === 'all' || $(this).data('category') === filter);
    });
  });

  $('.season-filter').on('click', function () {
    const filter = $(this).data('filter');
    $('.season-filter')
      .removeClass('border-sage bg-sage font-bold text-ink shadow-sm')
      .addClass('border-line bg-surface font-medium text-muted');
    $(this)
      .addClass('border-sage bg-sage font-bold text-ink shadow-sm')
      .removeClass('border-line bg-surface font-medium text-muted');
    $('.season-product').each(function () {
      $(this).toggle(filter === 'all' || $(this).data('category') === filter);
    });
  });

  $('#globalSearch').on('input', function () {
    const query = $(this).val().trim();
    if (!query) return;

    const matches = $('.product-card').filter(function () {
      return $(this).text().includes(query);
    }).length;

    if (matches) {
      $('#searchPanel').fadeOut(120);
      $('html, body').animate({ scrollTop: $('#shop').offset().top - 30 }, 450);
      showToast('وجدنا قطعاً تطابق بحثك');
    }
  });

  $('.favorite').on('click', function () {
    const isActive = !$(this).hasClass('text-copper');
    $(this).toggleClass('text-copper bg-[#fff3ea]', isActive);
    $(this).find('svg').toggleClass('fill-current', isActive);
    showToast(isActive ? 'أضيفت القطعة إلى المفضلة' : 'أزيلت القطعة من المفضلة');
  });

  $('.add-cart').on('click', function () {
    cartCount += 1;
    cartTotal += Number($(this).data('price'));
    $('#cartCount').text(cartCount);
    $('#cartTotal').text('₪' + cartTotal);
    $(this).text('تمت الإضافة').addClass('bg-olive text-white').prop('disabled', true);
    showToast('تمت إضافة القطعة إلى السلة');
  });

  $('#cartButton').on('click', function () {
    showToast('في السلة ' + cartCount + ' قطع بقيمة ₪' + cartTotal);
  });

  $('#newsletter').on('submit', function (event) {
    event.preventDefault();
    const email = $('#email').val();
    $(this).html('<div class="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-sage/40 text-sm font-bold"><span>تم الاشتراك بنجاح</span><i data-lucide="check" class="h-4 w-4"></i></div>');
    lucide.createIcons();
    showToast('أهلاً بك في مجتمع حِرفة، ' + email);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('sm:opacity-0', 'sm:translate-y-[22px]');
      entry.target.classList.add('opacity-100', 'translate-y-0');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
});
