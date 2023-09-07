'use strict';
class App{
  _containers = document.querySelectorAll('.slide');
  _steps = document.querySelectorAll('.flex-box');
  _prevNextButton = document.querySelector('.prenxt-btn-container');
  _planBoxContainer = document.querySelector('.plan-box-container');
  _monthYearToggle = document.querySelector('.month-year-btn');
  _addOnContainer = document.querySelector('.add-ons-container');
  _summaryContainer = document.querySelector('.final-step-container');

  _numSteps = this._steps.length - 1;
  _numSlides = this._containers.length - 1;
  _currSlide = 0;
  _users = {};
  _intervalId;

  //Elements
  _nameField = document.querySelector('.name-field');
  _emailField = document.querySelector('.email-field');
  _phoneNoField = document.querySelector('.phoneNo-field');

  //error elements
  _errorName = document.querySelector('.error-name');
  _errorEmail = document.querySelector('.error-email');
  _errorPhoneNo = document.querySelector('.error-phoneNo');

  constructor(){
    this._prevNextButton.insertAdjacentHTML('afterbegin', this.handlerPreNxtView());
    this._prevNextButton.addEventListener('click', this.handlerPrevNextButton.bind(this));
    this._planBoxContainer.addEventListener('click', this.handlerPlanBox.bind(this));
    this._monthYearToggle.addEventListener('click', this.handlerTogglePlan.bind(this)); 
    this._addOnContainer.addEventListener('click', this.handlerAddOn.bind(this)); 
  }

  handlerPrevNextButton(e){
    if(e.target.classList.contains('next-btn')){
      if(!this._nameField.value || !this._emailField.value || !this._phoneNoField.value){
       return this._errorName.textContent = 
        this._errorEmail.textContent = 
        this._errorPhoneNo.textContent = '*';
      }

      if(this._nameField.value || this._emailField.value || this._phoneNoField){
        this._users.name = this._nameField.value;
        this._users.email = this._emailField.value;
        this._users.phoneNo = this._phoneNoField.value;
      }

      if(this._currSlide === 1){
        const getPlan = this._planBoxContainer.querySelector('.active-plan-box');
        this._users.plan = {
          plan: getPlan.querySelector('h3').textContent,
          price: +getPlan.querySelector('.pd-price').textContent,
        };
        this._users.planType = getPlan.querySelector('.pd-my').textContent === 'mo' ? 'Monthly' : 'Yearly';
      }

      if(this._currSlide === 2){
        if(!this._users.addOns || this._users.addOns.length === 0) return;
      }

      if(this._currSlide === 2 && this._users.addOns.length > 0){
        this._summaryContainer.innerHTML = '';
        this._summaryContainer.insertAdjacentHTML('afterbegin', this.handlerFinalView(this._users));
      }
      
      this._currSlide++;
      this._clearButton();
      this._prevNextButton.insertAdjacentHTML('afterbegin', this.handlerPreNxtView());
      this._disableSlides();
      this._showSlide(this._currSlide);
      this._disableStep();
      this._showStep(this._currSlide);
      this._errorName.textContent = 
      this._errorEmail.textContent = 
      this._errorPhoneNo.textContent = '';
    }

    if(e.target.classList.contains('prev-btn')){
      this._currSlide--;
      this._clearButton();
      this._prevNextButton.insertAdjacentHTML('afterbegin', this.handlerPreNxtView());
      this._disableSlides(this._containers);
      this._showSlide(this._currSlide);
      this._disableStep();
      this._showStep(this._currSlide);
    }

    if(e.target.classList.contains('confirm-btn')){
      this._summaryContainer.innerHTML = `<img class="success-img" src="images/spinner.jpg" alt="successful">`;
      this._prevNextButton.classList.add('hidden');
      this._setTimeout();
    }
  }
  _clearButton(){
    this._prevNextButton.innerHTML = '';
  }

  _disableSlides(){
    this._containers.forEach(slide => slide.classList.add('hidden'));
  }
  _showSlide(index){
    this._containers[index].classList.remove('hidden');
  }

  _disableStep(){
    this._steps.forEach(step => step.querySelector('.num-container').classList.remove('active-box'));
  }
  _showStep(index){
    this._steps[index].querySelector('.num-container').classList.add('active-box');
  }

  handlerPlanBox(e){
    const btn = e.target.closest('.plan-box');
    if(!btn) return;

    this._planBoxContainer.querySelectorAll('.plan-box').forEach(planBox => planBox.classList.remove('active-plan-box'));
    btn.classList.add('active-plan-box');
  }

  handlerTogglePlan(){
    //reset checkbox
    this._addOnContainer.querySelectorAll('.check-field').forEach(checkbox => checkbox.checked = false);
    this._addOnContainer.querySelectorAll('.add-ons-box').forEach(plan => plan.classList.remove('active-add-ons'));

    //delete add ons from users
    delete this._users.addOns;
    
    this._monthYearToggle.classList.toggle('month-year-toggle');
    if(this._monthYearToggle.classList.contains('month-year-toggle')){
    this._planBoxContainer.querySelectorAll('.plan-box').forEach(planBox => this.planBoxQuery(planBox, 10));
    document.querySelectorAll('.add-ons-box').forEach(adsOn => this.adsOnQuery(adsOn, 10));
    }
    else{
    this._planBoxContainer.querySelectorAll('.plan-box').forEach(planBox =>  this.planBoxQuery(planBox, 1/10));
    document.querySelectorAll('.add-ons-box').forEach(adsOn => this.adsOnQuery(adsOn, 1/10));
    }
  }

  planBoxQuery(e, num){
   const price = e.querySelector('.pd-price').textContent  *= num;
   const monthYear = e.querySelector('.pd-my');
   const small = e.querySelector('.year-discount');
   return `${price}${monthYear.textContent === 'mo' ? monthYear.textContent = 'yr' : monthYear.textContent = 'mo'}
    ${monthYear.textContent === 'yr' ? small.textContent = '2 months free' : small.textContent = ''}
   `;
  }

  adsOnQuery(e, num){
    const price = e.querySelector('.adson-price').textContent  *= num;
    const monthYear = e.querySelector('.adson-my');
    return `${price}${monthYear.textContent === 'mo' ? monthYear.textContent = 'yr' : monthYear.textContent = 'mo'}`;
   }

   handlerAddOn(e){
    const btn = e.target.closest('.add-ons-box');
    const checkbox = btn.querySelector('.check-field');
    if(checkbox.checked){
    btn.classList.add('active-add-ons');
    if(!this._users.addOns){
      this._users.addOns = [{
        title: btn.querySelector('h3').textContent,
        description: btn.querySelector('p').textContent,
        price: +btn.querySelector('.adson-price').textContent
      }];
    }

    else this._users.addOns.push({
      title: btn.querySelector('h3').textContent,
      description: btn.querySelector('p').textContent,
      price: +btn.querySelector('.adson-price').textContent
    });

    }else{
      btn.classList.remove('active-add-ons');
      const index = this._users.addOns.findIndex(addOns => addOns.title === btn.querySelector('h3').textContent);
      this._users.addOns.splice(index, 1);
    }
   }

   handlerFinalView(data){
    return `
    <h2>Finishing up</h2>
    <p>Double check everything looks OK before confirming</p>

    <div class="final-step-wrapper">
    <div class="selected-options">
      <div class="category">
        <h3>${data.plan.plan} (${data.planType})</h3>
        <a href="">Change</a>
      </div>

      <p class="price-el">+$${data.plan.price}/${data.planType === 'Monthly' ? 'mo' : 'yr'}</p>
    </div>
    ${data.addOns.map(add => `<div class="selected-2">
    <div class="selected-2-category">
      <h3>${add.title}</h3>
      <p class="price-el">+$${add.price}/${data.planType === 'Monthly' ? 'mo' : 'yr'}</p>
    </div></div>`).join('')}


    </div>

    <div class="total-container">
          <h3>Total (per ${data.planType === 'Monthly' ? 'month' : 'year'})</h3>
          <p class="total-price">+$${data.plan.price + data.addOns.reduce((acc, add) => acc + add.price, 0)}/mo</p>
    </div>
    `;
   }

  handlerPreNxtView(){
    if(this._currSlide === 0){
      return this._markupNext();
    }
    if(this._currSlide > 0 && this._currSlide < this._numSlides){
      return `${this._markupPrev()}${this._markupNext()}`;
    }
    if(this._currSlide === this._numSlides){
      return `${this._markupPrev()}${this._markupConfirm()}`;
    }
    return '';
  }

  _markupNext(){
    return `
    <button class="next-btn">Next Step</button>
    `;
  }

  _markupPrev(){
    return `
    <button class="prev-btn">Go back</button>
    `;
  }

  _markupConfirm(){
    return `
    <button class="confirm-btn">CONFIRM</button>
    `;
  }

  _setTimeout(){
    clearTimeout(this._intervalId);
    this._intervalId = setTimeout(()=>{
      window.location.reload()
    }, 5000);
  }
}

const app = new App();