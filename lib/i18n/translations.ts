export type Language = 'hi' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  hi: {
    // Brand & Header
    'brand.name': 'वृंदावन शुद्ध शाकाहारी स्वीट्स & कैफ़े',
    'brand.short': 'वृंदावन स्वीट्स',
    'brand.badge': '100% शुद्ध शाकाहारी • FSSAI प्रमाणित',
    'nav.digital_menu': 'डिजिटल मेनू',
    'nav.owner_portal': 'व्यवस्थापक पोर्टल',
    'nav.home': 'मुख्य पृष्ठ',
    'nav.cart': 'कार्ट',
    'nav.track_order': 'आर्डर ट्रैक करें',
    'nav.admin_login': 'स्टाफ लॉगिन',
    'nav.dine_in_menu': 'डाइन-इन मेनू',
    'nav.switch_lang': 'भाषा बदलें',

    // Hero Section
    'hero.badge': 'स्कैन करें • आर्डर करें • टेबल पर भुगतान करें',
    'hero.title_part1': 'स्वादिष्ट व्यंजन, ',
    'hero.title_part2': 'शून्य प्रतीक्षा समय।',
    'hero.subtitle':
      'प्रामाणिक स्ट्रीट फूड और शुद्ध देसी गाय के घी से बनी मिठाइयों का आनंद लें। बस टेबल पर रखा QR कोड स्कैन करें, सेकंडों में आर्डर दें, और आसानी से भुगतान करें।',
    'hero.cta_order': 'लाइव मेनू देखें और आर्डर करें',
    'hero.cta_qr': 'डाइन-इन क्यूआर मेनू',

    // Features
    'feat.qr_title': 'संपर्क रहित क्यूआर',
    'feat.qr_desc': 'अपनी टेबल से तुरंत आर्डर करें',
    'feat.pay_title': 'UPI और नकद',
    'feat.pay_desc': 'सुरक्षित रेज़रपे या काउंटर पर',
    'feat.veg_title': '100% शुद्ध शाकाहारी',
    'feat.veg_desc': 'शुद्ध देसी गाय का घी',
    'feat.fast_title': 'त्वरित रसोई',
    'feat.fast_desc': 'लाइव आर्डर ट्रैकिंग',

    // Home Signature Delicacies
    'home.top_favorites': 'सर्वाधिक पसंदीदा',
    'home.signature_title': 'हमारे विशेष स्वादिष्ट व्यंजन',
    'home.explore_all': 'सभी व्यंजन देखें',
    'home.freshly_made': 'ताज़ा तैयार',
    'home.order_now': 'अभी आर्डर करें',
    'home.veg_tag': '100% शाकाहारी',

    // Home About Section
    'about.badge': 'वृंदावन के बारे में',
    'about.title': 'शुरुआत से ही पारंपरिक स्वाद को संजोए हुए',
    'about.p1':
      'में आपका स्वागत है। हम प्रामाणिक भारतीय स्नैक्स, स्ट्रीट फूड और पारंपरिक मिठाइयाँ पूरी तरह शुद्ध देसी गाय के घी में तैयार करने के लिए समर्पित हैं।',
    'about.p2':
      'हमारे आधुनिक डिजिटल क्यूआर आर्डरिंग सिस्टम के साथ, अब लाइन में लगे बिना या वेटर का इंतज़ार किए बिना अपनी टेबल पर गरमा-गरम भोजन पाएं।',
    'about.address_label': 'हमारा पता',
    'about.hours_label': 'खुलने का समय',
    'about.hours_open': 'प्रतिदिन (सातों दिन खुला)',
    'about.contact_label': 'संपर्क व पार्सल पूछताछ',
    'about.visiting_title': 'क्या आप रेस्टोरेंट में पधार रहे हैं?',
    'about.visiting_desc':
      'प्रत्येक डाइन-इन टेबल पर समर्पित QR कोड उपलब्ध है। अपने फोन के कैमरे से स्कैन करें और अपनी टेबल के लिए आज के ताज़ा व्यंजन तुरंत देखें।',
    'about.launch_menu': 'ऑनलाइन डिजिटल मेनू खोलें',

    // Footer
    'footer.fssai': 'FSSAI लाइसेंस सं. 12724001000456 • 100% शुद्ध शाकाहारी व्यंजन',
    'footer.all_rights': 'सर्वाधिकार सुरक्षित।',

    // Menu Page
    'menu.header_title': 'डिजिटल डाइन-इन मेनू',
    'menu.table': 'टेबल',
    'menu.search_placeholder': 'समोसा, कचौरी, चाय, मिठाई खोजें...',
    'menu.all_categories': 'सभी व्यंजन',
    'menu.loading': 'ताज़ा मेनू लोड हो रहा है...',
    'menu.no_dishes': 'कोई व्यंजन नहीं मिला',
    'menu.try_another': 'अन्य नाम खोजें या कोई दूसरी श्रेणी चुनें',
    'menu.veg': 'शाकाहारी',
    'menu.in_cart': 'कार्ट में',
    'menu.hot_fresh': 'गरमा-गरम और ताज़ा',
    'menu.add_btn': 'जोड़ें',
    'menu.total_payable': 'कुल देय राशि',
    'menu.view_cart': 'कार्ट देखें',

    // Cart & Checkout Page
    'cart.empty_title': 'आपकी कार्ट खाली है',
    'cart.empty_desc': 'हमारे मेनू से स्वादिष्ट समोसा, कचौरी, चाय और मिठाइयाँ अपनी पसंद से चुनें।',
    'cart.browse_menu': 'डिजिटल मेनू देखें',
    'checkout.page_title': 'चेकआउट और भुगतान',
    'checkout.back_to_menu': 'मेनू पर वापस जाएं',
    'checkout.customer_details': 'ग्राहक विवरण',
    'checkout.table_number': 'टेबल नंबर',
    'checkout.table_placeholder': 'उदा. Table 4',
    'checkout.name_label': 'आपका शुभ नाम',
    'checkout.name_placeholder': 'अपना पूरा नाम लिखें',
    'checkout.phone_label': 'मोबाइल नंबर (रसीद के लिए)',
    'checkout.phone_placeholder': '10 अंकों का मोबाइल नंबर',
    'checkout.notes_label': 'रसोई के लिए विशेष निर्देश (वैकल्पिक)',
    'checkout.notes_placeholder': 'उदा. कम मिर्च, बिना प्याज़, गरमा-गरम परोसें',
    'checkout.payment_method': 'भुगतान का तरीका चुनें',
    'checkout.pay_online_title': 'ऑनलाइन भुगतान (UPI / QR / कार्ड / नेटबैंकिंग)',
    'checkout.pay_online_desc': 'रेज़रपे द्वारा तुरंत व सुरक्षित भुगतान',
    'checkout.pay_cash_title': 'काउंटर पर नकद भुगतान करें (Cash on Counter)',
    'checkout.pay_cash_desc': 'आर्डर की पुष्टि के बाद कैशियर काउंटर पर भुगतान करें',
    'checkout.pay_test_title': 'टेस्ट भुगतान (त्वरित सैंडबॉक्स)',
    'checkout.pay_test_desc': 'बिना वास्तविक बैंक लेनदेन के डेमो टेस्ट करें',
    'checkout.order_summary': 'आर्डर सारांश',
    'checkout.subtotal': 'उप-योग (Subtotal)',
    'checkout.tax': 'जीएसटी (GST 5%)',
    'checkout.total': 'कुल देय राशि (Total Amount)',
    'checkout.submit_online': 'आर्डर करें और ऑनलाइन भुगतान करें',
    'checkout.submit_cash': 'काउंटर नकद आर्डर दर्ज करें',
    'checkout.submit_test': 'टेस्ट आर्डर सबमिट करें',
    'checkout.processing': 'आर्डर सबमिट हो रहा है...',
    'checkout.err_name': 'कृपया अपना नाम दर्ज करें।',
    'checkout.err_phone': 'कृपया आर्डर रसीद के लिए 10 अंकों का वैध मोबाइल नंबर दर्ज करें।',
    'checkout.err_order_fail': 'आर्डर बनाने में समस्या आई। कृपया पुनः प्रयास करें।',
    'checkout.clear_cart': 'कार्ट खाली करें',

    // Order Tracking Page
    'order.title': 'आर्डर ट्रैकिंग',
    'order.number': 'आर्डर सं.',
    'order.status_confirmed_title': 'आर्डर स्वीकृत हो चुका है!',
    'order.status_confirmed_desc': 'रसोई को आपका आर्डर मिल गया है और तैयारी शुरू हो रही है।',
    'order.status_preparing_title': 'व्यंजन ताज़ा तैयार हो रहे हैं',
    'order.status_preparing_desc': 'हमारे शेफ शुद्ध देसी घी में आपके व्यंजन बना रहे हैं।',
    'order.status_ready_title': 'आर्डर परोसने के लिए तैयार है!',
    'order.status_ready_desc': 'स्टाफ आपका गरमा-गरम भोजन टेबल पर ला रहा है।',
    'order.status_completed_title': 'आर्डर सफलतापूर्वक परोसा गया!',
    'order.status_completed_desc': 'आशा है आपको भोजन पसंद आया। राधे राधे!',
    'order.status_cancelled_title': 'आर्डर रद्द कर दिया गया',
    'order.status_cancelled_desc': 'यह आर्डर रद्द हो चुका है। सहायता के लिए काउंटर पर संपर्क करें।',
    'order.timeline': 'आर्डर स्थिति प्रगति',
    'order.details': 'आर्डर विवरण',
    'order.table': 'टेबल',
    'order.customer': 'ग्राहक',
    'order.payment_method': 'भुगतान विधि',
    'order.payment_status': 'भुगतान स्थिति',
    'order.paid': 'भुगतान संपन्न (Paid)',
    'order.unpaid_cash': 'काउंटर पर देय (Cash on Counter)',
    'order.ordered_items': 'आर्डर किए गए व्यंजन',
    'order.total_paid': 'कुल राशि',
    'order.view_receipt': 'डिजिटल रसीद देखें व डाउनलोड करें',
    'order.order_more': 'अन्य व्यंजन आर्डर करें',

    // Receipt Page
    'receipt.title': 'आधिकारिक डिजिटल रसीद',
    'receipt.print': 'प्रिंट करें',
    'receipt.download_pdf': 'पीडीएफ डाउनलोड करें',
    'receipt.share': 'शेयर करें',
    'receipt.copied': 'लिंक कॉपी हो गया!',
    'receipt.receipt_no': 'रसीद संख्या',
    'receipt.date': 'तारीख व समय',
    'receipt.customer': 'ग्राहक',
    'receipt.table': 'टेबल',
    'receipt.items': 'व्यंजन सूची',
    'receipt.qty': 'मात्रा',
    'receipt.amount': 'राशि',
    'receipt.subtotal': 'उप-योग',
    'receipt.tax': 'जीएसटी (5%)',
    'receipt.total': 'कुल भुगतान',
    'receipt.payment_mode': 'भुगतान माध्यम',
    'receipt.payment_status': 'स्थिति',
    'receipt.fssai_lic': 'FSSAI लाइसेंस सं.',
    'receipt.footer_msg': 'राधे राधे! हमारे यहाँ पधारने के लिए धन्यवाद। पुनः पधारें!',

    // Admin Sidebar & Layout
    'admin.nav_overview': 'डैशबोर्ड सारांश',
    'admin.nav_orders': 'लाइव आर्डर',
    'admin.nav_products': 'व्यंजन सूची',
    'admin.nav_categories': 'श्रेणियाँ',
    'admin.nav_payments': 'भुगतान बही',
    'admin.nav_receipts': 'रसीदें',
    'admin.nav_reports': 'दैनिक रिपोर्ट्स',
    'admin.nav_best_sellers': 'बेस्ट सेलर्स',
    'admin.nav_qr_codes': 'टेबल क्यूआर कोड',
    'admin.nav_settings': 'स्टोर सेटिंग्स',
    'admin.nav_logout': 'लॉग आउट',
    'admin.nav_view_store': 'ग्राहक स्टोर देखें',
    'admin.portal_title': 'वृंदावन रेस्टोरेंट एडमिन',
    'admin.tagline': 'क्विक सर्विस रेस्टोरेंट व कैफ़े',

    // Admin Common Buttons & Badges
    'admin.btn_refresh': 'ताज़ा करें',
    'admin.btn_save': 'सहेजें',
    'admin.btn_cancel': 'रद्द करें',
    'admin.btn_edit': 'संपादित करें',
    'admin.btn_delete': 'हटाएं',
    'admin.btn_add_item': 'नया व्यंजन जोड़ें',
    'admin.btn_add_cat': 'नई श्रेणी जोड़ें',
    'admin.confirm_cash': 'नकद भुगतान स्वीकृत करें',
    'admin.mark_preparing': 'तैयारी शुरू करें',
    'admin.mark_ready': 'तैयार घोषित करें',
    'admin.mark_completed': 'पूर्ण मार्क करें',
    'admin.mark_cancelled': 'रद्द करें',
  },

  en: {
    // Brand & Header
    'brand.name': 'Vrindavan Pure Veg Sweets & Café',
    'brand.short': 'Vrindavan Sweets',
    'brand.badge': '100% Pure Veg • FSSAI Certified',
    'nav.digital_menu': 'Digital Menu',
    'nav.owner_portal': 'Owner Portal',
    'nav.home': 'Home',
    'nav.cart': 'Cart',
    'nav.track_order': 'Track Order',
    'nav.admin_login': 'Staff Login',
    'nav.dine_in_menu': 'Dine-In Menu',
    'nav.switch_lang': 'Switch Language',

    // Hero Section
    'hero.badge': 'Scan • Order • Pay at Your Table',
    'hero.title_part1': 'Delicious Delicacies, ',
    'hero.title_part2': 'Zero Wait Time.',
    'hero.subtitle':
      'Experience authentic street food and pure desi ghee sweets. Simply scan the QR code on your table, order in seconds, and pay seamlessly.',
    'hero.cta_order': 'View Live Menu & Order',
    'hero.cta_qr': 'Dine-In QR Menu',

    // Features
    'feat.qr_title': 'Contactless QR',
    'feat.qr_desc': 'Order from your table',
    'feat.pay_title': 'UPI & Cash',
    'feat.pay_desc': 'Secure Razorpay or counter',
    'feat.veg_title': 'Pure Veg',
    'feat.veg_desc': 'Pure Desi Cow Ghee',
    'feat.fast_title': 'Fast Kitchen',
    'feat.fast_desc': 'Live order tracking',

    // Home Signature Delicacies
    'home.top_favorites': 'Top Favorites',
    'home.signature_title': 'Our Signature Delicacies',
    'home.explore_all': 'Explore all items',
    'home.freshly_made': 'Freshly Made',
    'home.order_now': 'Order Now',
    'home.veg_tag': '100% Veg',

    // Home About Section
    'about.badge': 'About Vrindavan',
    'about.title': 'Preserving Heritage Flavors Since Inception',
    'about.p1':
      '. We are committed to serving authentic Indian snacks, street food, and authentic sweets prepared strictly in pure cow desi ghee and cold-pressed oils.',
    'about.p2':
      'With our modernized QR ordering system, you enjoy the freshest food served hot at your table without standing in queues or waiting for paper menus.',
    'about.address_label': 'Address',
    'about.hours_label': 'Opening Hours',
    'about.hours_open': '(Open All 7 Days)',
    'about.contact_label': 'Contact & Takeaway Enquiries',
    'about.visiting_title': 'Visiting Our Restaurant?',
    'about.visiting_desc':
      'Each dine-in table features a dedicated QR code. Scan it directly with your smartphone camera to immediately load your table number and view today\'s available specialties.',
    'about.launch_menu': 'Launch Digital Menu Online',

    // Footer
    'footer.fssai': 'FSSAI Lic. 12724001000456 • 100% Pure Veg Delicacies',
    'footer.all_rights': 'All rights reserved.',

    // Menu Page
    'menu.header_title': 'Digital Dine-In Menu',
    'menu.table': 'Table',
    'menu.search_placeholder': 'Search samosa, kachori, tea, sweets...',
    'menu.all_categories': 'All Delicacies',
    'menu.loading': 'Preparing fresh menu...',
    'menu.no_dishes': 'No dishes found',
    'menu.try_another': 'Try another search or select a different category',
    'menu.veg': 'Veg',
    'menu.in_cart': 'in cart',
    'menu.hot_fresh': 'Hot & Fresh',
    'menu.add_btn': 'Add',
    'menu.total_payable': 'Total payable',
    'menu.view_cart': 'View Cart',

    // Cart & Checkout Page
    'cart.empty_title': 'Your cart is empty',
    'cart.empty_desc': 'Explore our menu and add authentic samosas, kachoris, tea, and sweets to your order.',
    'cart.browse_menu': 'Browse Digital Menu',
    'checkout.page_title': 'Checkout & Payment',
    'checkout.back_to_menu': 'Back to Menu',
    'checkout.customer_details': 'Customer Details',
    'checkout.table_number': 'Table Number',
    'checkout.table_placeholder': 'e.g. Table 4',
    'checkout.name_label': 'Your Full Name',
    'checkout.name_placeholder': 'Enter your full name',
    'checkout.phone_label': 'Mobile Number (for Receipt)',
    'checkout.phone_placeholder': '10-digit mobile number',
    'checkout.notes_label': 'Special Cooking Instructions (Optional)',
    'checkout.notes_placeholder': 'e.g. Extra crispy, less spicy, serve hot',
    'checkout.payment_method': 'Select Payment Method',
    'checkout.pay_online_title': 'Pay Online (UPI / QR / Cards / NetBanking)',
    'checkout.pay_online_desc': 'Instant secure digital payment via Razorpay',
    'checkout.pay_cash_title': 'Pay Cash at Counter',
    'checkout.pay_cash_desc': 'Pay in cash at billing desk after order placement',
    'checkout.pay_test_title': 'Test Payment (Instant Sandbox)',
    'checkout.pay_test_desc': 'Simulate payment without real gateway',
    'checkout.order_summary': 'Order Summary',
    'checkout.subtotal': 'Subtotal',
    'checkout.tax': 'GST (5%)',
    'checkout.total': 'Total Amount Payable',
    'checkout.submit_online': 'Place Order & Pay Online',
    'checkout.submit_cash': 'Place Cash on Counter Order',
    'checkout.submit_test': 'Submit Test Order',
    'checkout.processing': 'Processing Order...',
    'checkout.err_name': 'Please enter your name.',
    'checkout.err_phone': 'Please enter a valid 10-digit mobile number for order receipt.',
    'checkout.err_order_fail': 'Failed to create order. Please try again.',
    'checkout.clear_cart': 'Clear Cart',

    // Order Tracking Page
    'order.title': 'Order Status',
    'order.number': 'Order #',
    'order.status_confirmed_title': 'Order Confirmed!',
    'order.status_confirmed_desc': 'Received by kitchen and preparation starting.',
    'order.status_preparing_title': 'Preparing Fresh in Kitchen',
    'order.status_preparing_desc': 'Our chefs are cooking your delicacies with pure desi cow ghee.',
    'order.status_ready_title': 'Order Ready to Serve!',
    'order.status_ready_desc': 'Staff is serving fresh delicacies to your table.',
    'order.status_completed_title': 'Order Successfully Served!',
    'order.status_completed_desc': 'We hope you enjoyed the delicacies. Radhe Radhe!',
    'order.status_cancelled_title': 'Order Cancelled',
    'order.status_cancelled_desc': 'This order was cancelled. Please contact the counter for assistance.',
    'order.timeline': 'Order Progress Timeline',
    'order.details': 'Order Details',
    'order.table': 'Table',
    'order.customer': 'Customer',
    'order.payment_method': 'Payment Method',
    'order.payment_status': 'Payment Status',
    'order.paid': 'Paid',
    'order.unpaid_cash': 'Unpaid (Pay at Counter)',
    'order.ordered_items': 'Ordered Items',
    'order.total_paid': 'Total Amount',
    'order.view_receipt': 'View & Download Digital Receipt',
    'order.order_more': 'Place Another Order',

    // Receipt Page
    'receipt.title': 'Official Digital Receipt',
    'receipt.print': 'Print',
    'receipt.download_pdf': 'Download PDF',
    'receipt.share': 'Share',
    'receipt.copied': 'Link copied to clipboard!',
    'receipt.receipt_no': 'Receipt #',
    'receipt.date': 'Date & Time',
    'receipt.customer': 'Customer',
    'receipt.table': 'Table',
    'receipt.items': 'Items',
    'receipt.qty': 'Qty',
    'receipt.amount': 'Amount',
    'receipt.subtotal': 'Subtotal',
    'receipt.tax': 'GST (5%)',
    'receipt.total': 'Total Paid',
    'receipt.payment_mode': 'Payment Mode',
    'receipt.payment_status': 'Status',
    'receipt.fssai_lic': 'FSSAI Lic. No.',
    'receipt.footer_msg': 'Radhe Radhe! Thank you for dining with us. Please visit again!',

    // Admin Sidebar & Layout
    'admin.nav_overview': 'Overview',
    'admin.nav_orders': 'Live Orders',
    'admin.nav_products': 'Products',
    'admin.nav_categories': 'Categories',
    'admin.nav_payments': 'Payments',
    'admin.nav_receipts': 'Receipts',
    'admin.nav_reports': 'Daily Reports',
    'admin.nav_best_sellers': 'Best Sellers',
    'admin.nav_qr_codes': 'QR Codes',
    'admin.nav_settings': 'Business Settings',
    'admin.nav_logout': 'Logout',
    'admin.nav_view_store': 'View Store',
    'admin.portal_title': 'Vrindavan Admin',
    'admin.tagline': 'Quick Service Restaurant & Café',

    // Admin Common Buttons & Badges
    'admin.btn_refresh': 'Refresh',
    'admin.btn_save': 'Save',
    'admin.btn_cancel': 'Cancel',
    'admin.btn_edit': 'Edit',
    'admin.btn_delete': 'Delete',
    'admin.btn_add_item': 'Add Item',
    'admin.btn_add_cat': 'Add Category',
    'admin.confirm_cash': 'Confirm Cash Payment',
    'admin.mark_preparing': 'Start Preparing',
    'admin.mark_ready': 'Mark Ready',
    'admin.mark_completed': 'Mark Completed',
    'admin.mark_cancelled': 'Cancel Order',
  },
};

// Dish Translations Dictionary
const dishTranslations: Record<string, string> = {
  'Special Samosa (2 Pcs)': 'स्पेशल समोसा (2 पीस)',
  'Samosa': 'समोसा',
  'Khasta Hing Kachori (2 Pcs)': 'खस्ता हींग कचौरी (2 पीस)',
  'Kachori': 'कचौरी',
  'Aloo Tikki Chaat': 'आलू टिक्की चाट',
  'Bedmi Puri with Aloo Sabzi': 'बेड़मी पूरी आलू सब्ज़ी',
  'Poha': 'पोहा',
  'Tea': 'चाय',
  'Masala Chai (Kulhad)': 'मसाला चाय (कुल्हड़)',
  'Special Masala Chai': 'स्पेशल मसाला चाय',
  'Desi Ghee Jalebi': 'देसी घी की जलेबी',
  'Jalebi': 'जलेबी',
  'Gulab Jamun (Desi Ghee)': 'गुलाब जामुन (देसी घी)',
  'Gulab Jamun': 'गुलाब जामुन',
  'Kaju Katli (250g)': 'काजू कतली (250 ग्राम)',
  'Kaju Katli': 'काजू कतली',
  'Special Lassi (Malai Maar Ke)': 'स्पेशल लस्सी (मलाई मार के)',
  'Sweet Lassi': 'मीठी लस्सी',
  'Lassi': 'लस्सी',
  'Vrindavan Special Thali': 'वृंदावन स्पेशल थाली',
  'Deluxe Thali': 'डीलक्स थाली',
  'Chole Bhature': 'छोले भटूरे',
  'Pav Bhaji': 'पाव भाजी',
  'Dhokla': 'ढोकला',
  'Rasgulla': 'रसगुल्ला',
  'Rasmalai': 'रसमलाई',
  'Paneer Butter Masala': 'पनीर बटर मसाला',
  'Dal Makhani': 'दाल मखनी',
};

// Category Translations Dictionary
const categoryTranslations: Record<string, string> = {
  'Snacks & Chaat': 'स्नैक्स और चाट',
  'Breakfast & Morning Delights': 'नाश्ता और सुबह के व्यंजन',
  'Pure Desi Ghee Sweets': 'शुद्ध देसी घी की मिठाइयाँ',
  'Beverages & Tea': 'चाय और पेय पदार्थ',
  'Thali & Meals': 'थाली और भोजन',
  'All Delicacies': 'सभी व्यंजन',
  'All': 'सभी',
  'Beverages': 'पेय पदार्थ',
  'Sweets': 'मिठाइयाँ',
  'Snacks': 'स्नैक्स',
};

// Description Translations Dictionary
const descriptionTranslations: Record<string, string> = {
  'Golden crispy crust filled with fragrant spiced potatoes and green peas.':
    'सुगंधित मसालों, आलू और हरी मटर से भरा कुरकुरा और खस्ता समोसा।',
  'Flaky khasta kachori with spiced moong dal served with hing aloo sabzi.':
    'मूंग दाल और मसालों से भरी खस्ता कचौरी, स्वादिष्ट हींग वाले आलू के साथ।',
  'Hot kadak ginger & cardamom spiced Indian masala chai.':
    'ताज़ा अदरक और इलायची के स्वाद वाली कड़क कुल्हड़ मसाला चाय।',
  'Steamed flattened rice with peanuts, mustard seeds, and crunchy Ratlami sev.':
    'मूंगफली, राई और रतलामी सेव से सजा स्वादिष्ट और हल्का पोहा।',
  'Crisp fried potato patties topped with sweet yogurt, tamarind chutney, and fresh mint sauce.':
    'दही, मीठी सोंठ और हरी चटनी के साथ कुरकुरी आलू टिक्की चाट।',
  'Traditional mathura style crispy urad dal stuffed pooris served with spicy aloo gravy.':
    'पारंपरिक मथुरा शैली में उड़द दाल की खस्ता पूरी और रसेदार आलू सब्ज़ी।',
  'Crispy golden spirals soaked in pure desi cow ghee and saffron sugar syrup.':
    'शुद्ध देसी गाय के घी और केसर की चाशनी में डूबी कुरकुरी गरमा-गरम जलेबी।',
  'Soft melt-in-mouth cottage cheese dumplings dipped in rose-scented cardamom syrup.':
    'गुलाब और इलायची की चाशनी में डूबे कोमल और रसीले गुलाब जामुन।',
  'Premium cashew fudge squares adorned with silver vark, made with zero adulteration.':
    'शुद्ध काजू और चांदी के वर्क से बनी प्रीमियम पारंपरिक काजू कतली।',
  'Thick churned sweet yogurt drink topped with a generous layer of fresh clotted cream (malai).':
    'गाढ़े मीठे दही से बनी मलाईदार और ठंडी ताज़ा लस्सी।',
  'Complete royal meal: 4 Desi Ghee Puris, Paneer Sabzi, Dal Tadka, Aloo Sabzi, Rice, Gulab Jamun & Raita.':
    'शाही भोजन: 4 देसी घी पूरी, पनीर सब्ज़ी, दाल तड़का, आलू सब्ज़ी, चावल, गुलाब जामुन और रायता।',
};

export function translateDish(name: string, lang: Language): string {
  if (lang !== 'hi') return name;
  return dishTranslations[name] || name;
}

export function translateCategory(name: string, lang: Language): string {
  if (lang !== 'hi') return name;
  return categoryTranslations[name] || name;
}

export function translateDescription(desc: string | null | undefined, lang: Language): string {
  if (!desc) return '';
  if (lang !== 'hi') return desc;
  return descriptionTranslations[desc] || desc;
}

export function translateStatus(status: string, lang: Language): { label: string; desc: string } {
  if (lang === 'hi') {
    switch (status) {
      case 'PENDING_PAYMENT':
        return { label: 'भुगतान प्रतीक्षारत', desc: 'भुगतान की पुष्टि बाकी है' };
      case 'CONFIRMED':
        return { label: 'आर्डर स्वीकृत', desc: 'रसोई में भेजा गया' };
      case 'PREPARING':
        return { label: 'ताज़ा तैयार हो रहा है', desc: 'शुद्ध देसी घी में बन रहा है' };
      case 'READY':
        return { label: 'परोसने के लिए तैयार', desc: 'टेबल पर लाया जा रहा है' };
      case 'COMPLETED':
        return { label: 'पूर्ण हुआ', desc: 'टेबल पर परोसा गया' };
      case 'CANCELLED':
        return { label: 'रद्द', desc: 'आर्डर रद्द कर दिया गया' };
      default:
        return { label: status, desc: '' };
    }
  }

  switch (status) {
    case 'PENDING_PAYMENT':
      return { label: 'Pending Payment', desc: 'Awaiting payment confirmation' };
    case 'CONFIRMED':
      return { label: 'Order Confirmed', desc: 'Received by kitchen' };
    case 'PREPARING':
      return { label: 'Preparing Fresh', desc: 'Cooking with desi ghee' };
    case 'READY':
      return { label: 'Order Ready', desc: 'Ready to serve' };
    case 'COMPLETED':
      return { label: 'Completed', desc: 'Served at table' };
    case 'CANCELLED':
      return { label: 'Cancelled', desc: 'Order was cancelled' };
    default:
      return { label: status, desc: '' };
  }
}

export function translatePaymentMethod(method: string, lang: Language): string {
  if (lang === 'hi') {
    switch (method) {
      case 'ONLINE_RAZORPAY':
        return 'ऑनलाइन (UPI / कार्ड)';
      case 'CASH':
        return 'काउंटर पर नकद';
      case 'TEST':
        return 'टेस्ट मोड';
      default:
        return method;
    }
  }

  switch (method) {
    case 'ONLINE_RAZORPAY':
      return 'Online (UPI / Cards)';
    case 'CASH':
      return 'Cash on Counter';
    case 'TEST':
      return 'Test Mode';
    default:
      return method;
  }
}

