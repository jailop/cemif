TSC = tsc -t es6 -m es6

all: table.js \
	 singleindicator.js \
	 annualbudget.js \
	 plots.js

table.js: table.ts
	${TSC} table.ts

singleindicator.js: singleindicator.ts
	${TSC} singleindicator.ts

annualbudget.js: annualbudget.ts
	${TSC} annualbudget.ts

plots.js: plots.ts
	${TSC} plots.ts
