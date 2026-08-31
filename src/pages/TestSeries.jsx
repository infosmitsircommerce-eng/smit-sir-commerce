import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock, FileText, BarChart2, Play, Award, CheckCircle2, ArrowRight,
  ShieldCheck, Target, BookOpenCheck, Zap, X, RotateCcw, Trophy
} from 'lucide-react';

const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });

const tests = [
  {
    id: 1, name: 'Partnership Firms Chapter Test', subject: 'Accountancy', class: 12, marks: 10, time: '15 min', difficulty: 'Medium', type: 'Chapter Test', isFree: true,
    questions: [
      q('In the absence of a partnership deed, interest on capital is:', ['Allowed at 6% p.a.', 'Allowed at 12% p.a.', 'Not allowed', 'Allowed only to working partners'], 2, 'Under the Partnership Act, interest on capital is not allowed unless the deed provides for it.'),
      q('If the partnership deed is silent, profits and losses are shared:', ['In capital ratio', 'Equally', 'In old ratio', 'In sales ratio'], 1, 'Partners share profits and losses equally when the deed does not specify a ratio.'),
      q('Interest on drawings is generally:', ['An expense of the firm', 'An income of the firm', 'A liability to outsiders', 'A capital loss'], 1, 'Interest on drawings is charged to partners and therefore becomes income for the firm.'),
      q('A partner’s salary is treated as:', ['A charge against profit', 'An appropriation of profit', 'A business expense before net profit', 'A current liability only'], 1, 'Partner salary is an appropriation of profit, not a business operating expense.'),
      q('Goodwill represents:', ['Physical cash balance', 'Value of business reputation', 'Total liabilities', 'Only tangible assets'], 1, 'Goodwill is an intangible asset representing reputation and earning capacity.'),
      q('Sacrificing ratio is calculated at the time of:', ['Admission', 'Dissolution only', 'Retirement only', 'Every purchase'], 0, 'On admission, existing partners may sacrifice part of their profit share in favour of the incoming partner.'),
      q('Gaining ratio is commonly calculated at the time of:', ['Admission', 'Retirement or death', 'Purchase of machinery', 'Issue of shares'], 1, 'Remaining partners may gain the outgoing partner’s share at retirement or death.'),
      q('Revaluation account is prepared to record:', ['Cash transactions only', 'Change in values of assets and liabilities', 'Sales returns', 'Bank reconciliation'], 1, 'Revaluation account records increases/decreases in asset and liability values at reconstitution.'),
      q('Accumulated profits at admission are generally distributed among old partners in:', ['New ratio', 'Old ratio', 'Gaining ratio', 'Equal ratio always'], 1, 'Accumulated profits belong to old partners and are distributed in the old profit-sharing ratio.'),
      q('If a new partner brings premium for goodwill in cash, it is credited to sacrificing partners in:', ['New ratio', 'Sacrificing ratio', 'Capital ratio', 'Gaining ratio'], 1, 'Goodwill compensation goes to partners who sacrifice their share.'),
    ],
  },
  {
    id: 2, name: 'Unit Test 1 — Accountancy Class 12', subject: 'Accountancy', class: 12, marks: 10, time: '15 min', difficulty: 'Medium', type: 'Unit Test', isFree: false,
    questions: [
      q('A change in profit-sharing ratio among existing partners is called:', ['Dissolution', 'Reconstitution', 'Realisation', 'Liquidation'], 1, 'A change in the relationship among partners while the firm continues is reconstitution.'),
      q('General Reserve on admission is normally transferred to:', ['New partner only', 'Old partners’ capital accounts', 'Cash account', 'Revaluation account'], 1, 'General Reserve accumulated before admission belongs to old partners.'),
      q('Hidden goodwill is inferred when:', ['Goodwill is purchased for cash', 'Capital and profit-share information imply total firm value', 'There are no assets', 'A firm has losses'], 1, 'Hidden goodwill is calculated from implied total capital/value.'),
      q('When liabilities are understated, revaluation account is:', ['Credited', 'Debited', 'Ignored', 'Closed immediately'], 1, 'An increase in liabilities is a loss on revaluation and is debited.'),
      q('When an asset is appreciated, revaluation account is:', ['Debited', 'Credited', 'Not affected', 'Transferred to cash'], 1, 'Increase in asset value is a gain on revaluation and is credited.'),
      q('Premium for goodwill brought by new partner compensates:', ['All creditors', 'Sacrificing partners', 'Employees', 'Bank'], 1, 'The premium compensates old partners who give up profit share.'),
      q('If old ratio is 3:2 and new ratio is 1:1, first partner sacrifices:', ['1/10', '1/5', '1/2', 'Nothing'], 0, '3/5 − 1/2 = 1/10.'),
      q('A partner’s current account is usually maintained under:', ['Fixed capital method', 'Fluctuating capital method only', 'Single entry only', 'Cash basis'], 0, 'Under fixed capital method, adjustments are recorded through current accounts.'),
      q('Under fluctuating capital method, drawings are recorded in:', ['Separate drawings ledger only', 'Partner’s capital account', 'Revaluation account', 'Realisation account'], 1, 'All partner-related adjustments are recorded in capital accounts under fluctuating capital.'),
      q('Profit on revaluation at admission is shared by:', ['All partners including new partner', 'Old partners only', 'New partner only', 'Creditors'], 1, 'The revaluation gain arose before the new partner joined, so old partners receive it.'),
    ],
  },
  {
    id: 3, name: 'Full Syllabus Test — Class 12 Accountancy', subject: 'Accountancy', class: 12, marks: 10, time: '18 min', difficulty: 'Hard', type: 'Full Syllabus Test', isFree: false,
    questions: [
      q('At dissolution, assets transferred to Realisation Account are generally recorded on its:', ['Credit side', 'Debit side', 'Balance sheet only', 'Cash book'], 1, 'Assets being realised are transferred to the debit side of Realisation Account.'),
      q('Liabilities transferred to Realisation Account are recorded on its:', ['Debit side', 'Credit side', 'Cash side', 'Capital side'], 1, 'External liabilities are transferred to the credit side.'),
      q('Cash received from sale of an unrecorded asset is credited to:', ['Capital Account', 'Realisation Account', 'Revaluation Account', 'Bank Loan Account'], 1, 'Proceeds from unrecorded assets are gains on realisation.'),
      q('If a partner takes over an asset on dissolution, the partner’s capital account is:', ['Credited', 'Debited', 'Not affected', 'Closed first'], 1, 'The partner receives an asset from the firm, so capital is debited.'),
      q('Goodwill appearing in books on dissolution is transferred to:', ['Realisation Account', 'Cash Account', 'Partner salary account', 'Reserve only'], 0, 'Book goodwill is an asset and is transferred with other assets.'),
      q('Shares issued at premium increase:', ['Securities Premium', 'Debentures', 'Trade payables', 'Revenue reserve only'], 0, 'The excess over face value is credited to Securities Premium.'),
      q('Calls in arrears represent:', ['Amount received in advance', 'Called amount not yet received', 'Premium only', 'Capital reserve'], 1, 'Calls in arrears are unpaid amounts due from shareholders.'),
      q('Debenture holders are:', ['Owners', 'Creditors', 'Employees', 'Promoters only'], 1, 'Debenture holders lend funds to the company and are creditors.'),
      q('Interest on debentures is:', ['Appropriation of profit', 'Charge against profit', 'Capital profit', 'Optional dividend'], 1, 'Debenture interest is a finance cost payable irrespective of profits.'),
      q('Cash Flow from Operating Activities mainly relates to:', ['Core revenue-generating operations', 'Issue of shares only', 'Purchase of fixed assets only', 'Repayment of debentures only'], 0, 'Operating activities arise from the principal revenue-producing activities of the enterprise.'),
    ],
  },
  {
    id: 4, name: 'Pre-Board Test — Class 12 Commerce', subject: 'All Subjects', class: 12, marks: 10, time: '18 min', difficulty: 'Hard', type: 'Pre-Board Test', isFree: false,
    questions: [
      q('Which function of management sets objectives in advance?', ['Staffing', 'Planning', 'Directing', 'Controlling'], 1, 'Planning decides objectives and actions in advance.'),
      q('GDP at market price includes:', ['Only wages', 'Value of final goods and services produced domestically', 'Imports only', 'Transfer payments only'], 1, 'GDP measures domestic final production over a period.'),
      q('A debenture holder is a:', ['Shareholder', 'Creditor', 'Manager', 'Customer'], 1, 'Debenture holders are lenders to the company.'),
      q('Repo rate is the rate at which:', ['Public lends to banks', 'Central bank lends to commercial banks', 'Banks lend only to exporters', 'Firms lend to government'], 1, 'Repo rate is a policy rate for central bank lending against securities.'),
      q('Unity of Command means an employee should receive orders from:', ['Many bosses', 'One superior', 'Customers', 'External auditors'], 1, 'Fayol’s Unity of Command advocates one boss for one subordinate.'),
      q('Current Ratio compares:', ['Current assets and current liabilities', 'Fixed assets and capital', 'Sales and debtors only', 'Profit and sales'], 0, 'Current Ratio = Current Assets / Current Liabilities.'),
      q('Which is a non-financial incentive?', ['Bonus', 'Profit sharing', 'Job enrichment', 'Commission'], 2, 'Job enrichment enhances responsibility and growth rather than direct monetary reward.'),
      q('Balance of Payments records transactions between:', ['Only banks', 'Residents and the rest of the world', 'Only governments', 'Only exporters'], 1, 'BOP records economic transactions between residents and non-residents.'),
      q('Goodwill is classified as:', ['Current liability', 'Intangible asset', 'Fictitious asset always', 'Cash equivalent'], 1, 'Goodwill is an intangible asset.'),
      q('Consumer right to be informed concerns:', ['Accurate product information', 'Free gifts', 'Unlimited credit', 'No invoices'], 0, 'Consumers have a right to information about quality, quantity, price and related details.'),
    ],
  },
  {
    id: 5, name: 'Management Principles Chapter Test', subject: 'Business Studies', class: 12, marks: 10, time: '12 min', difficulty: 'Easy', type: 'Chapter Test', isFree: true,
    questions: [
      q('Who proposed the 14 Principles of Management?', ['F.W. Taylor', 'Henri Fayol', 'Peter Drucker', 'Elton Mayo'], 1, 'Henri Fayol developed the 14 Principles of Management.'),
      q('Unity of Direction means:', ['One employee, one boss', 'One head and one plan for similar activities', 'Equal salary for all', 'No delegation'], 1, 'Activities with the same objective should have one head and one plan.'),
      q('Scalar Chain refers to:', ['Pay scale', 'Formal line of authority', 'Production schedule', 'Marketing channel'], 1, 'Scalar Chain is the chain of superior-subordinate authority from top to bottom.'),
      q('Esprit de Corps promotes:', ['Individual rivalry', 'Team spirit', 'Centralisation only', 'Punishment'], 1, 'Esprit de Corps means fostering unity and team spirit.'),
      q('Scientific Management is associated with:', ['Fayol', 'Taylor', 'Maslow', 'Kotler'], 1, 'F.W. Taylor is known as the father of Scientific Management.'),
      q('Differential Piece Wage System rewards:', ['Only attendance', 'Higher efficiency with higher wage rate', 'Seniority only', 'All workers equally'], 1, 'Taylor proposed differential rates to encourage efficient workers.'),
      q('Functional Foremanship is based on:', ['One specialist only', 'Specialisation in supervision', 'No supervision', 'Informal leadership only'], 1, 'Taylor divided supervision among specialist foremen.'),
      q('Order principle means:', ['Orders from many bosses', 'A proper place for every person and thing', 'Only written orders', 'No flexibility'], 1, 'Fayol’s Order principle focuses on material and social order.'),
      q('Equity means managers should be:', ['Harsh', 'Kind and just', 'Biased', 'Secretive'], 1, 'Equity combines fairness and kindness in treatment.'),
      q('Initiative encourages employees to:', ['Avoid ideas', 'Develop and execute plans', 'Ignore rules', 'Work without goals'], 1, 'Initiative gives employees scope to think and act within authority.'),
    ],
  },
  {
    id: 6, name: 'National Income MCQ Test', subject: 'Economics', class: 12, marks: 10, time: '12 min', difficulty: 'Medium', type: 'MCQ Test', isFree: true,
    questions: [
      q('National Income is commonly measured as:', ['NDP at MP', 'NNP at FC', 'GDP at MP', 'GNP at MP'], 1, 'In traditional CBSE terminology, National Income is NNP at Factor Cost.'),
      q('Depreciation is also known as:', ['Capital gain', 'Consumption of fixed capital', 'Transfer payment', 'Inventory investment'], 1, 'Depreciation measures the wearing out/consumption of fixed capital.'),
      q('GDP measures production within:', ['Citizenship boundaries only', 'Domestic territory', 'Foreign territory only', 'Households only'], 1, 'GDP is based on domestic territory.'),
      q('GNP equals GDP plus:', ['Depreciation', 'Net factor income from abroad', 'Indirect taxes', 'Subsidies'], 1, 'GNP = GDP + Net Factor Income from Abroad.'),
      q('Transfer payments are excluded because they:', ['Are illegal', 'Do not correspond to current production', 'Are imports', 'Are always taxes'], 1, 'Transfers redistribute income without payment for current productive services.'),
      q('Intermediate goods are excluded to avoid:', ['Inflation', 'Double counting', 'Unemployment', 'Imports'], 1, 'Counting both intermediate and final goods would overstate production.'),
      q('Value Added equals value of output minus:', ['Wages', 'Intermediate consumption', 'Profit', 'Tax only'], 1, 'Value added deducts intermediate consumption from output value.'),
      q('Net Domestic Product equals GDP minus:', ['NFIA', 'Depreciation', 'Subsidies', 'Exports'], 1, 'NDP = GDP − depreciation.'),
      q('Real GDP is measured at:', ['Current prices', 'Constant prices', 'Future prices', 'Import prices'], 1, 'Real GDP uses base-year/constant prices to remove price effects.'),
      q('Nominal GDP is measured at:', ['Constant prices', 'Current prices', 'Only factor cost', 'Only export prices'], 1, 'Nominal GDP uses current-year prices.'),
    ],
  },
  {
    id: 7, name: 'Marketing Case Study Test', subject: 'Business Studies', class: 12, marks: 10, time: '15 min', difficulty: 'Hard', type: 'Case-Study Test', isFree: false,
    questions: [
      q('A company redesigns packaging to make its product easier to identify. This is mainly a decision under:', ['Product', 'Price', 'Place', 'Public finance'], 0, 'Packaging is part of the product element of the marketing mix.'),
      q('A firm offers a temporary “buy 1 get 1” deal. This is:', ['Advertising', 'Sales promotion', 'Personal selling', 'Public relations only'], 1, 'Short-term purchase incentives are sales-promotion tools.'),
      q('A salesperson gives a live demonstration to a buyer. This is:', ['Personal selling', 'Advertising', 'Publicity only', 'Branding'], 0, 'Direct oral presentation to a prospective buyer is personal selling.'),
      q('Choosing wholesalers and retailers relates to:', ['Product', 'Price', 'Place', 'Promotion only'], 2, 'Distribution channels are part of Place.'),
      q('A brand name primarily helps in:', ['Product identification and differentiation', 'Tax collection', 'Lowering wages', 'Replacing distribution'], 0, 'Branding helps consumers identify and distinguish offerings.'),
      q('A company sets a very low introductory price to attract buyers. This decision is part of:', ['Product', 'Price', 'Place', 'People'], 1, 'Setting the amount charged is a pricing decision.'),
      q('Providing accurate ingredients on a label supports the consumer’s right to:', ['Be informed', 'Choose only luxury goods', 'Avoid bills', 'Unlimited return'], 0, 'Labels communicate essential information to consumers.'),
      q('A manufacturer advertises on television to a mass audience. The key advantage is:', ['Personal feedback', 'Wide reach', 'No cost', 'Guaranteed purchase'], 1, 'Advertising can reach a large audience efficiently.'),
      q('Warehousing primarily creates:', ['Form utility', 'Time utility', 'Ownership only', 'No utility'], 1, 'Storage makes products available when needed, creating time utility.'),
      q('After-sales service mainly contributes to:', ['Customer satisfaction and retention', 'Tax evasion', 'Production stoppage', 'Eliminating promotion'], 0, 'Service after purchase can build satisfaction, trust and repeat business.'),
    ],
  },
  {
    id: 8, name: 'Class 11 Accountancy — Unit Test 1', subject: 'Accountancy', class: 11, marks: 10, time: '15 min', difficulty: 'Medium', type: 'Unit Test', isFree: false,
    questions: [
      q('The basic accounting equation is:', ['Assets = Liabilities + Capital', 'Assets = Sales − Purchases', 'Capital = Assets + Liabilities', 'Expenses = Assets'], 0, 'The accounting equation reflects claims of owners and outsiders on assets.'),
      q('Purchase of furniture for cash results in:', ['Increase in one asset and decrease in another', 'Increase in liability', 'Increase in capital', 'Decrease in expense'], 0, 'Furniture increases while cash decreases by the same amount.'),
      q('A transaction is first recorded in:', ['Ledger', 'Journal', 'Trial Balance', 'Balance Sheet'], 1, 'Journal is the book of original entry.'),
      q('Posting means transferring entries from:', ['Ledger to journal', 'Journal to ledger', 'Trial balance to journal', 'Balance sheet to cash book'], 1, 'Posting classifies journal entries into individual ledger accounts.'),
      q('Debit the receiver and credit the giver applies to:', ['Real account', 'Personal account', 'Nominal account', 'Cash flow only'], 1, 'This is the traditional rule for personal accounts.'),
      q('Debit what comes in and credit what goes out applies to:', ['Real account', 'Nominal account', 'Personal account', 'Revenue account only'], 0, 'This is the traditional rule for real accounts.'),
      q('Debit all expenses and losses applies to:', ['Nominal account', 'Real account', 'Personal account', 'Asset account only'], 0, 'Nominal accounts record expenses, losses, incomes and gains.'),
      q('Trial Balance mainly checks:', ['Arithmetic accuracy of ledger postings', 'Market value of assets', 'Profitability only', 'Cash theft only'], 0, 'A trial balance checks whether debit and credit totals agree.'),
      q('Cash discount is generally:', ['Recorded in books', 'Never recorded', 'Only a memorandum', 'A capital receipt'], 0, 'Cash discount is recorded because it is linked to prompt payment.'),
      q('Trade discount is generally:', ['Recorded separately in ledger', 'Not recorded in books', 'Shown as interest', 'Shown as capital'], 1, 'Trade discount is deducted from list price before recording the transaction.'),
    ],
  },
  {
    id: 9, name: 'Class 12 Economics — Full Test Series', subject: 'Economics', class: 12, marks: 10, time: '15 min', difficulty: 'Hard', type: 'Subject-Wise Test', isFree: false,
    questions: [
      q('If MPC is 0.8, the simple investment multiplier is:', ['2', '4', '5', '8'], 2, 'Multiplier = 1 / (1 − MPC) = 1 / 0.2 = 5.'),
      q('An increase in repo rate generally tends to:', ['Encourage borrowing', 'Reduce borrowing and credit expansion', 'Increase fiscal deficit directly', 'Increase exports automatically'], 1, 'Higher repo rate raises the cost of funds and can restrain credit.'),
      q('Current Account of BOP includes:', ['Only capital transfers', 'Trade in goods and services plus income/transfers', 'Only foreign loans', 'Only FDI'], 1, 'Current account covers goods, services, primary income and transfers.'),
      q('When planned aggregate demand is less than output, inventories tend to:', ['Fall unexpectedly', 'Rise unexpectedly', 'Remain zero', 'Become imports'], 1, 'Unsold output accumulates as unintended inventory investment.'),
      q('Fiscal deficit broadly shows:', ['Excess of total expenditure over non-borrowing receipts', 'Only interest payments', 'Only revenue expenditure', 'Exports minus imports'], 0, 'Fiscal deficit indicates the government’s borrowing requirement.'),
      q('CRR is the fraction of deposits banks keep:', ['With the central bank', 'Only as gold at home', 'With customers', 'With stock exchanges'], 0, 'Cash Reserve Ratio is maintained with the central bank.'),
      q('If exports exceed imports, the trade balance is:', ['Deficit', 'Surplus', 'Zero by definition', 'A capital loss'], 1, 'Exports greater than imports create a trade surplus.'),
      q('Autonomous consumption is consumption when income is:', ['Maximum', 'Zero', 'Negative only', 'Equal to savings'], 1, 'It is the intercept of the consumption function at zero income.'),
      q('In a two-sector model, equilibrium occurs where:', ['S = 0 always', 'AD = AS', 'Imports = exports', 'Taxes = transfers'], 1, 'Macroeconomic equilibrium output occurs where planned aggregate expenditure equals output.'),
      q('Foreign exchange demand for imports rises when:', ['Imports rise', 'Exports rise only', 'Domestic saving rises automatically', 'CRR rises'], 0, 'Importers demand foreign currency to pay overseas sellers.'),
    ],
  },
];

const testTypes = ['All', 'Chapter Test', 'Unit Test', 'Full Syllabus Test', 'Pre-Board Test', 'MCQ Test', 'Case-Study Test', 'Subject-Wise Test'];

const pillStyle = (active) => active
  ? { background: 'var(--ink)', color: 'var(--ivory-on-ink)', border: '1px solid var(--ink)' }
  : { background: 'var(--bg-white)', color: 'var(--muted)', border: '1px solid var(--border)' };

function TestRunner({ test, onClose }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const current = test.questions[index];
  const score = useMemo(() => test.questions.reduce((total, item, i) => total + (answers[i] === item.answer ? 1 : 0), 0), [answers, test]);

  const restart = () => { setIndex(0); setAnswers({}); setSubmitted(false); };

  return (
    <div className="fixed inset-0 z-[100] p-3 sm:p-6 overflow-y-auto" style={{ background: 'rgba(30,24,18,0.72)', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-3xl mx-auto min-h-full flex items-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-paper w-full p-5 sm:p-8 relative">
          <button onClick={onClose} aria-label="Close test" className="absolute right-4 top-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-ivory)', color: 'var(--muted)' }}><X className="w-4 h-4" /></button>

          {!submitted ? (
            <>
              <div className="pr-12">
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>{test.subject} · {test.type}</div>
                <h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{test.name}</h2>
                <div className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Question {index + 1} of {test.questions.length}</div>
              </div>

              <div className="h-2 rounded-full mt-6 overflow-hidden" style={{ background: 'var(--border-soft)' }}><div className="h-full" style={{ width: `${((index + 1) / test.questions.length) * 100}%`, background: 'var(--gold)' }} /></div>

              <div className="mt-8">
                <h3 className="text-xl leading-relaxed" style={{ color: 'var(--ink)' }}>{current.question}</h3>
                <div className="grid gap-3 mt-5">
                  {current.options.map((option, optionIndex) => {
                    const selected = answers[index] === optionIndex;
                    return <button key={option} onClick={() => setAnswers(prev => ({ ...prev, [index]: optionIndex }))} className="text-left rounded-xl p-4 transition-all" style={{ border: selected ? '2px solid var(--gold)' : '1px solid var(--border)', background: selected ? 'var(--gold-bg)' : 'var(--bg-white)', color: 'var(--charcoal)' }}><strong className="mr-2">{String.fromCharCode(65 + optionIndex)}.</strong>{option}</button>;
                  })}
                </div>
              </div>

              <div className="flex justify-between gap-3 mt-8">
                <button disabled={index === 0} onClick={() => setIndex(i => i - 1)} className="btn-secondary disabled:opacity-40">Previous</button>
                {index < test.questions.length - 1
                  ? <button disabled={answers[index] === undefined} onClick={() => setIndex(i => i + 1)} className="btn-primary disabled:opacity-40">Next</button>
                  : <button disabled={answers[index] === undefined} onClick={() => setSubmitted(true)} className="btn-primary disabled:opacity-40">Submit Test</button>}
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-4">
                <Trophy className="w-12 h-12 mx-auto" style={{ color: 'var(--gold)' }} />
                <div className="eyebrow mt-4">Test completed</div>
                <h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{score}/{test.questions.length}</h2>
                <p className="mt-2" style={{ color: 'var(--muted)' }}>{Math.round((score / test.questions.length) * 100)}% score</p>
              </div>

              <div className="space-y-4 mt-6 max-h-[50vh] overflow-y-auto pr-1">
                {test.questions.map((item, i) => {
                  const correct = answers[i] === item.answer;
                  return <div key={item.question} className="rounded-xl p-4" style={{ border: '1px solid var(--border)', background: correct ? 'rgba(77,124,15,0.05)' : 'rgba(180,83,60,0.05)' }}>
                    <div className="font-semibold" style={{ color: 'var(--ink)' }}>{i + 1}. {item.question}</div>
                    <div className="text-sm mt-2" style={{ color: correct ? 'var(--green)' : '#B4533C' }}>{correct ? 'Correct' : `Correct answer: ${String.fromCharCode(65 + item.answer)}. ${item.options[item.answer]}`}</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{item.explanation}</div>
                  </div>;
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button onClick={restart} className="btn-secondary flex-1 inline-flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Retake</button>
                <button onClick={onClose} className="btn-primary flex-1">Back to Test Series</button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function TestCard({ test, onStart }) {
  const diffColors = { Easy: 'var(--green)', Medium: 'var(--gold)', Hard: '#B4533C' };
  return (
    <motion.article whileHover={{ y: -4 }} className="card-paper flex flex-col p-5 relative overflow-hidden">
      {!test.isFree && <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, var(--gold), #e7c66c)' }} />}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="text-xs mb-1" style={{ color: 'var(--subtle)' }}>{test.subject} · {test.type}</div>
          <h3 className="text-base leading-tight" style={{ fontWeight: 700, color: 'var(--ink)' }}>{test.name}</h3>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0" style={test.isFree ? { background: 'rgba(77,124,15,0.08)', border: '1px solid rgba(77,124,15,0.25)', color: 'var(--green)' } : { background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)', color: 'var(--gold)' }}>{test.isFree ? 'FREE' : 'PRO'}</span>
      </div>
      <div className="flex flex-wrap gap-3 text-xs mb-5" style={{ color: 'var(--muted)' }}>
        <span className="flex items-center gap-1"><Award className="w-3 h-3" style={{ color: 'var(--gold)' }} /> {test.marks} marks</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.time}</span>
        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {test.questions.length} Qs</span>
        <span className="font-medium" style={{ color: diffColors[test.difficulty] }}>{test.difficulty}</span>
      </div>
      <button onClick={() => onStart(test)} className="btn-primary mt-auto inline-flex items-center justify-center gap-2"><Play className="w-4 h-4" /> Start Test</button>
    </motion.article>
  );
}

export default function TestSeries() {
  const [filterType, setFilterType] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [activeTest, setActiveTest] = useState(null);
  const filtered = tests.filter((t) => (filterType === 'All' || t.type === filterType) && (filterClass === 'All' || t.class === Number(filterClass)));
  const freeCount = tests.filter(t => t.isFree).length;
  const totalQuestions = tests.reduce((sum, test) => sum + test.questions.length, 0);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      {activeTest && <TestRunner test={activeTest} onClose={() => setActiveTest(null)} />}

      <section className="page-hero overflow-hidden">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
            <div>
              <span className="eyebrow">CBSE Commerce Test Series</span>
              <h1 className="mt-5 max-w-3xl">Don’t just study. <em>Prove you’re exam-ready.</em></h1>
              <p className="mt-5 text-lg max-w-2xl" style={{ color: 'var(--muted)' }}>Every test below now contains real questions, instant scoring, answer review and explanations — so students can actually practise, not just browse cards.</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button onClick={() => document.getElementById('test-library')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary inline-flex items-center justify-center gap-2"><Play className="w-4 h-4" /> Start a test</button>
                <Link to="/contact" className="btn-secondary inline-flex items-center justify-center gap-2">Ask about full access <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>

            <div className="card-paper p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><Target className="w-6 h-6" /></div><div><div className="font-bold" style={{ color: 'var(--ink)' }}>Live Practice Library</div><div className="text-sm" style={{ color: 'var(--muted)' }}>Questions + scoring + explanations</div></div></div>
              <div className="space-y-3">
                {['All 9 test cards are now playable', `${totalQuestions} original questions currently live`, 'Instant score after submission', 'Correct-answer review with explanations', 'Works on mobile and desktop'].map(item => <div key={item} className="flex items-start gap-2 text-sm"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }} /><span style={{ color: 'var(--charcoal)' }}>{item}</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: BookOpenCheck, value: tests.length, label: 'Playable tests' },
            { icon: Zap, value: freeCount, label: 'Free starters' },
            { icon: FileText, value: totalQuestions, label: 'Live questions' },
            { icon: ShieldCheck, value: '3', label: 'Core subjects' },
          ].map(({ icon: Icon, value, label }) => <div key={label} className="card-paper p-4 text-center"><Icon className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--gold)' }} /><div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{value}</div><div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div></div>)}
        </div>
      </section>

      <section id="test-library" className="page-container section-padding">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div><span className="eyebrow">Practice library</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Choose your test</h2></div>
          <div className="toggle-paper">{['All', '12', '11'].map((c) => <button key={c} onClick={() => setFilterClass(c)} className={filterClass === c ? 'active' : ''}>{c === 'All' ? 'All Classes' : `Class ${c}`}</button>)}</div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">{testTypes.map((t) => <button key={t} onClick={() => setFilterType(t)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors" style={pillStyle(filterType === t)}>{t}</button>)}</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{filtered.map((test) => <TestCard key={test.id} test={test} onStart={setActiveTest} />)}</div>
      </section>
    </div>
  );
}
