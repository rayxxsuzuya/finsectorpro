const headerBurger = document.querySelector('.butter');
const headerMobile = document.querySelector('.header-mobile');
const headerMobileBg = document.querySelector('.header-mobile__bg');

headerBurger.addEventListener('click', () => {
    headerBurger.classList.toggle('butter-active');
    headerMobile.classList.toggle('active');
});

headerMobileBg.addEventListener('click', () => {
    headerBurger.classList.remove('butter-active');
    headerMobile.classList.remove('active');
})


if (document.getElementById('loanSlider')) {
    class LoanCalculator {
        constructor() {
            this.loanSlider = document.getElementById('loanSlider');
            this.termSlider = document.getElementById('termSlider');
            this.loanAmountInput = document.getElementById('loanAmount');
            this.loanTermInput = document.getElementById('loanTerm');
            this.loanSliderFill = document.getElementById('loanSliderFill');
            this.termSliderFill = document.getElementById('termSliderFill');

            this.monthlyPaymentEl = document.getElementById('monthlyPayment');
            this.totalAmountEl = document.getElementById('totalAmount');
            this.overpaymentEl = document.getElementById('overpayment');
            this.pskRateEl = document.getElementById('pskRate');

            this.annualRate = 0.49855; // 49.855% годовых

            this.init();
        }

        init() {
            // Слушатели для слайдеров
            this.loanSlider.addEventListener('input', () => this.updateFromSlider('loan'));
            this.termSlider.addEventListener('input', () => this.updateFromSlider('term'));

            // Слушатели для инпутов
            this.loanAmountInput.addEventListener('input', () => this.updateFromInput('loan'));
            this.loanTermInput.addEventListener('input', () => this.updateFromInput('term'));
            this.loanAmountInput.addEventListener('blur', () => this.formatInput('loan'));
            this.loanTermInput.addEventListener('blur', () => this.formatInput('term'));

            // Инициализация заливки слайдеров
            this.updateSliderFill('loan');
            this.updateSliderFill('term');

            this.calculate();
        }

        updateFromSlider(type) {
            if (type === 'loan') {
                const value = parseInt(this.loanSlider.value);
                this.loanAmountInput.value = this.formatMoney(value);
            } else {
                const value = parseInt(this.termSlider.value);
                this.loanTermInput.value = `${value} мес.`;
            }
            this.updateSliderFill(type);
            this.calculate();
        }

        updateFromInput(type) {
            if (type === 'loan') {
                const value = this.parseMoneyInput(this.loanAmountInput.value);
                const clampedValue = Math.max(50000, Math.min(5000000, value));
                this.loanSlider.value = clampedValue;
                this.updateSliderFill('loan');
            } else {
                const value = parseInt(this.loanTermInput.value.replace(/[^\d]/g, '')) || 6;
                const clampedValue = Math.max(6, Math.min(60, value));
                this.termSlider.value = clampedValue;
                this.updateSliderFill('term');
            }
            this.calculate();
        }

        updateSliderFill(type) {
            if (type === 'loan') {
                const value = parseInt(this.loanSlider.value);
                const min = parseInt(this.loanSlider.min);
                const max = parseInt(this.loanSlider.max);
                const percentage = ((value - min) / (max - min)) * 100;
                this.loanSliderFill.style.width = percentage + '%';
            } else {
                const value = parseInt(this.termSlider.value);
                const min = parseInt(this.termSlider.min);
                const max = parseInt(this.termSlider.max);
                const percentage = ((value - min) / (max - min)) * 100;
                this.termSliderFill.style.width = percentage + '%';
            }
        }

        formatInput(type) {
            if (type === 'loan') {
                const value = this.parseMoneyInput(this.loanAmountInput.value);
                const clampedValue = Math.max(50000, Math.min(5000000, value));
                this.loanAmountInput.value = this.formatMoney(clampedValue);
                this.loanSlider.value = clampedValue;
                this.updateSliderFill('loan');
            } else {
                const value = parseInt(this.loanTermInput.value.replace(/[^\d]/g, '')) || 6;
                const clampedValue = Math.max(6, Math.min(60, value));
                this.loanTermInput.value = `${clampedValue} мес.`;
                this.termSlider.value = clampedValue;
                this.updateSliderFill('term');
            }
            this.calculate();
        }

        parseMoneyInput(input) {
            // Удаляем все символы кроме цифр
            return parseInt(input.replace(/[^\d]/g, '')) || 0;
        }

        formatMoney(amount) {
            return `${amount.toLocaleString('ru-RU')} ₽`;
        }

        calculate() {
            const principal = parseInt(this.loanSlider.value);
            const termMonths = parseInt(this.termSlider.value);
            const monthlyRate = this.annualRate / 12;

            // Расчет аннуитетного платежа
            const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                (Math.pow(1 + monthlyRate, termMonths) - 1);

            const totalAmount = monthlyPayment * termMonths;
            const overpayment = totalAmount - principal;

            // Обновляем интерфейс
            this.monthlyPaymentEl.textContent = this.formatMoney(Math.round(monthlyPayment));
            this.totalAmountEl.textContent = this.formatMoney(Math.round(totalAmount));
            this.overpaymentEl.textContent = this.formatMoney(Math.round(overpayment));
            this.pskRateEl.textContent = `${(this.annualRate * 100).toFixed(3)}%`;
        }
    }

    // Инициализация калькулятора при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
        new LoanCalculator();
    });
}