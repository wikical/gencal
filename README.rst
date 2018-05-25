What is GenCal
--------------

GenCal are files to have a website displaying specific events near its
visitors. They are static files requiring no framework. The data of the events
are pulled using JavaScript from https://wikical.com. Examples using it:
https://femical.org https://jamsession.events

To test it anytime, just open ``index.html`` in your browser.


Customisation steps
-------------------

1. Download the files, or alternatively clone the `GenCal repository`__ with::

        git clone https://github.com/wikical/gencal.git

__ https://github.com/wikical/gencal

2. Change the logo, replacing all ``*.png`` and ``*.jpg``
   files with others in the same format. Alternatively, you can use the
   included bash script to generate all files from a single logo file as::

        ./genlogos.sh path_to_logo_file

   For the script to work, you need imagemagick_ installed.

3. Edit ``index.html`` and replace all texts starting with ``&hearts;``.

4. Also in ``index.html``, replace the values of ``default_location`` and
   ``lookup_query``. The former will be used when your visitors deny to share
   their location, the later to select events from https://wikical.com/ .

5. Edit ``site.webmanifest`` and set appropriate values for ``name``,
   ``short_name`` and ``start_url``.

6. Optionally, edit ``css/gencal.css``, ``browserconfig.xml`` and
   ``site.webmanifest`` setting different colors. You can use ``gencolors.sh``
   to see the colors most used in your logo from step 2, ordered by frequency::

        ./gencolors.sh path_to_logo_file

7. Upload the files to your hoster.

If you are using Nginx_, see ``nginx.conf.example`` for an configuration example
assuming your domain is ``example.com`` and your server is accessible under
``123.123.123.123``. Consider using letsencrypt_ for getting certificates.


Licensing, copyright, acknowledgements
--------------------------------------

* The sample logo is public domain at https://publicdomainvectors.org/en/free-clipart/Appointment-coming/59292.html
* The sample color scheme is from: https://coolors.co/6699cc-fff275-ff8c42-ff3c38-a23e48

Copyright 2018 wikical gGmbH

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


.. _GenCal repository: https://github.com/wikical/gencal
.. _Nginx: https://www.nginx.com/
.. _imagemagick: https://www.imagemagick.org/script/download.php
.. _letsencrypt: https://letsencrypt.org/
