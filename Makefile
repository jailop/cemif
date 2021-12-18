all:
	python preproc.py
	make -C res/components
	make -C res/css
