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
      dropdownSignOut: document.getElementById('dropdownSignOut'),
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

    /* Profile dropdown */
    els.profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleProfileDropdown();
    });
    els.dropdownOverlay.addEventListener('click', closeProfileDropdown);

    /* Dropdown actions */
    els.dropdownSignOut.addEventListener('click', handleSignOut);
    els.sidebarSignOut.addEventListener('click', handleSignOut);

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
  function toggleProfileDropdown() {
    const isActive = els.profileDropdown.classList.contains('active');
    if (isActive) closeProfileDropdown();
    else openProfileDropdown();
  }

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
    NovaApp.showToast(`Welcome to Nova, ${user.name}!`, 'success');
    notifyListeners(user);
  }

  function handleSignOut() {
    closeProfileDropdown();
    currentUser = null;
    NovaData.clearCurrentUser();
    updateUI(null);
    NovaApp.switchTab('home');
    NovaApp.showToast('You have been signed out', 'info');
    notifyListeners(null);
  }

  /* ─── UI UPDATE ─── */
  function updateUI(user) {
    if (user) {
      els.navAuthBtns.style.display = 'none';
      els.navProfile.style.display = 'flex';
      els.profileName.textContent = user.name;
      els.profileAvatar.textContent = user.name.charAt(0).toUpperCase();
      els.dropdownName.textContent = user.name;
      els.dropdownEmail.textContent = user.email;
      els.dropdownAvatar.textContent = user.name.charAt(0).toUpperCase();
    } else {
      els.navAuthBtns.style.display = 'flex';
      els.navProfile.style.display = 'none';
      els.dropdownAdmin.style.display = 'none';
      els.sidebarAdmin.style.display = 'none';
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
