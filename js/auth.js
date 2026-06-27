/* ════════════════════════════════════════════════════════════════════
   NOVA — Authentication Module
   ════════════════════════════════════════════════════════════════════ */

const NovaAuth = (() => {

  /* ─── STATE ─── */
  let currentUser = NovaData.getCurrentUser();
  let authListeners = [];

  /* ─── DOM REFS (set by init) ─── */
  let els = {};

  function init() {
    els = {
      signInBtn: document.getElementById('signInBtn'),
      signUpBtn: document.getElementById('signUpBtn'),
      signInModal: document.getElementById('signInModal'),
      signUpModal: document.getElementById('signUpModal'),
      signInClose: document.getElementById('signInClose'),
      signUpClose: document.getElementById('signUpClose'),
      signInForm: document.getElementById('signInForm'),
      signUpForm: document.getElementById('signUpForm'),
      siEmail: document.getElementById('siEmail'),
      siPassword: document.getElementById('siPassword'),
      suName: document.getElementById('suName'),
      suEmail: document.getElementById('suEmail'),
      suPassword: document.getElementById('suPassword'),
      suConfirm: document.getElementById('suConfirm'),
      suToSignIn: document.getElementById('suToSignIn'),
      siToSignUp: document.getElementById('siToSignUp'),
      signInModalContent: document.getElementById('signInModalContent'),
      signUpModalContent: document.getElementById('signUpModalContent'),
      navAuthBtns: document.getElementById('navAuthBtns'),
      navProfile: document.getElementById('navProfile'),
      profileName: document.getElementById('profileName'),
      profileAvatar: document.getElementById('profileAvatar'),
      profileDropdown: document.getElementById('profileDropdown'),
      dropdownOverlay: document.getElementById('dropdownOverlay'),
      dropdownName: document.getElementById('dropdownName'),
      dropdownEmail: document.getElementById('dropdownEmail'),
      dropdownAvatar: document.getElementById('dropdownAvatar'),
      dropdownAvatarWrap: document.getElementById('dropdownAvatarWrap'),
      avatarUploadBtn: document.getElementById('avatarUploadBtn'),
      avatarInput: document.getElementById('avatarInput'),
      sidebarSignOut: document.getElementById('sidebarSignOut'),
      profileTrigger: document.getElementById('profileTrigger'),
      commentSubmitBtn: document.getElementById('commentSubmitBtn')
    };

    bindEvents();
    updateUI(currentUser);
  }

  /* ─── EVENTS ─── */
  function bindEvents() {
    /* Open modals */
    els.signInBtn.addEventListener('click', () => openModal('signIn'));
    els.signUpBtn.addEventListener('click', () => openModal('signUp'));

    /* Close modals (backdrop click) */
    els.signInModal.querySelector('.modal-backdrop').addEventListener('click', () => closeModal('signIn'));
    els.signUpModal.querySelector('.modal-backdrop').addEventListener('click', () => closeModal('signUp'));
    els.signInClose.addEventListener('click', () => closeModal('signIn'));
    els.signUpClose.addEventListener('click', () => closeModal('signUp'));

    /* ESC key close */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal('signIn');
        closeModal('signUp');
        closeProfileDropdown();
      }
    });

    /* Switch between modals */
    els.suToSignIn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal('signUp');
      setTimeout(() => openModal('signIn'), 200);
    });
    els.siToSignUp.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal('signIn');
      setTimeout(() => openModal('signUp'), 200);
    });

    /* Sign In */
    els.signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSignIn();
    });

    /* Sign Up */
    els.signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSignUp();
    });

    /* Profile dropdown toggled via inline onclick attribute */
    els.dropdownOverlay.addEventListener('click', closeProfileDropdown);

    /* Dropdown actions — handled by inline onclick in index.html */

    /* Avatar upload */
    els.avatarUploadBtn.addEventListener('click', () => els.avatarInput.click());
    els.avatarInput.addEventListener('change', handleAvatarUpload);

    /* Close dropdown on resize */
    window.addEventListener('resize', closeProfileDropdown);
  }

  /* ─── MODAL CONTROL ─── */
  function openModal(type) {
    const modal = type === 'signIn' ? els.signInModal : els.signUpModal;
    const content = type === 'signIn' ? els.signInModalContent : els.signUpModalContent;
    modal.style.display = 'flex';
    document.body.classList.add('no-scroll');
    /* Reset any exit animation */
    content.classList.remove('exit');
    /* Trigger reflow */
    void content.offsetWidth;
  }

  function closeModal(type) {
    const modal = type === 'signIn' ? els.signInModal : els.signUpModal;
    const content = type === 'signIn' ? els.signInModalContent : els.signUpModalContent;
    content.classList.add('exit');
    setTimeout(() => {
      modal.style.display = 'none';
      content.classList.remove('exit');
      document.body.classList.remove('no-scroll');
      /* Reset forms */
      if (type === 'signIn') els.signInForm.reset();
      else els.signUpForm.reset();
    }, 300);
  }

  /* ─── PROFILE DROPDOWN ─── */
  function openProfileDropdown() {
    els.profileDropdown.classList.add('active');
    els.dropdownOverlay.classList.add('active');
  }

  function closeProfileDropdown() {
    els.profileDropdown.classList.remove('active');
    els.dropdownOverlay.classList.remove('active');
  }

  /* ─── AUTH HANDLERS ─── */
  function handleSignIn() {
    const email = els.siEmail.value.trim();
    const password = els.siPassword.value.trim();

    if (!email || !password) {
      NovaApp.showToast('Please fill in all fields', 'error');
      return;
    }

    const user = NovaData.authenticateUser(email, password);
    if (!user) {
      NovaApp.showToast('Invalid email or password', 'error');
      /* Shake animation */
      els.signInModalContent.style.animation = 'none';
      void els.signInModalContent.offsetWidth;
      els.signInModalContent.style.animation = 'shake 0.5s ease';
      return;
    }

    currentUser = user;
    NovaData.setCurrentUser(user);
    updateUI(user);
    closeModal('signIn');
    NovaApp.showToast(`Welcome back, ${user.name}!`, 'success');
    notifyListeners(user);
  }

  function handleSignUp() {
    const name = els.suName.value.trim();
    const email = els.suEmail.value.trim();
    const password = els.suPassword.value.trim();
    const confirm = els.suConfirm.value.trim();

    if (!name || !email || !password || !confirm) {
      NovaApp.showToast('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirm) {
      NovaApp.showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      NovaApp.showToast('Password must be at least 6 characters', 'error');
      return;
    }

    /* Check if default admin is being recreated */
    if (email === 'admin@gmail.com') {
      NovaApp.showToast('This email is reserved. Please use a different email.', 'error');
      return;
    }

    const user = NovaData.addUser(name, email, password);
    if (!user) {
      NovaApp.showToast('An account with this email already exists', 'error');
      return;
    }

    /* Auto sign in after sign up */
    currentUser = user;
    NovaData.setCurrentUser(user);
    updateUI(user);
    closeModal('signUp');
    NovaApp.showToast(`Welcome to HAKHAMENSH-NEWS, ${user.name}!`, 'success');
    notifyListeners(user);
  }

  function handleSignOut() {
    /* Directly clear user and reload */
    try { closeProfileDropdown(); } catch(e) {}
    currentUser = null;
    try {
      const data = JSON.parse(localStorage.getItem('nova_data')) || {};
      data.currentUser = null;
      localStorage.setItem('nova_data', JSON.stringify(data));
    } catch(e) {}
    try { updateUI(null); } catch(e) {}
    try { notifyListeners(null); } catch(e) {}
    /* Force full page reload to reset all state */
    location.reload();
  }

  /* ─── AVATAR UPLOAD ─── */
  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!currentUser) return;

    const reader = new FileReader();
    reader.onload = function(ev) {
      const dataUrl = ev.target.result;
      NovaData.saveAvatar(currentUser.id, dataUrl);

      /* Update the avatar displays immediately */
      setAvatarImage(els.profileAvatar, dataUrl);
      setAvatarImage(els.dropdownAvatar, dataUrl);

      NovaApp.showToast('Profile photo updated!', 'success');
    };
    reader.readAsDataURL(file);
    /* Reset so the same file can be selected again */
    e.target.value = '';
  }

  function setAvatarImage(el, dataUrl, user) {
    const name = user ? user.name : (currentUser ? currentUser.name : '');
    if (dataUrl) {
      el.style.backgroundImage = `url(${dataUrl})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.textContent = '';
    } else {
      el.style.backgroundImage = '';
      el.textContent = name ? name.charAt(0).toUpperCase() : 'A';
    }
  }

  /* ─── UI UPDATE ─── */
  function updateUI(user) {
    if (user) {
      els.navAuthBtns.style.display = 'none';
      els.navProfile.style.display = 'flex';
      els.profileName.textContent = user.name;
      els.dropdownName.textContent = user.name;
      els.dropdownEmail.textContent = user.email;
      /* Load avatar if saved */
      const avatarUrl = NovaData.getAvatar(user.id);
      if (avatarUrl) {
        setAvatarImage(els.profileAvatar, avatarUrl, user);
        setAvatarImage(els.dropdownAvatar, avatarUrl, user);
      } else {
        setAvatarImage(els.profileAvatar, null, user);
        setAvatarImage(els.dropdownAvatar, null, user);
      }
      /* Show sidebar sign out */
      els.sidebarSignOut.style.display = 'flex';
    } else {
      els.navAuthBtns.style.display = 'flex';
      els.navProfile.style.display = 'none';
      els.dropdownAdmin?.style ? (els.dropdownAdmin.style.display = 'none') : null;
      els.sidebarAdmin?.style ? (els.sidebarAdmin.style.display = 'none') : null;
      /* Hide sidebar sign out */
      els.sidebarSignOut.style.display = 'none';
    }
  }

  /* ─── LISTENERS ─── */
  function onAuthChange(fn) {
    authListeners.push(fn);
  }

  function notifyListeners(user) {
    authListeners.forEach(fn => fn(user));
  }

  function getUser() {
    return currentUser;
  }

  function isAuthenticated() {
    return currentUser !== null;
  }

  function isAdmin() {
    return currentUser && currentUser.isAdmin === true;
  }

  /* ─── PUBLIC API ─── */
  return {
    init,
    getUser,
    isAuthenticated,
    isAdmin,
    onAuthChange,
    openModal,
    closeModal
  };
})();
