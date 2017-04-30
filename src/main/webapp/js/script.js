$(function () {
        const rootURL = "rest";

        findAll();

        /**
         * Запрос на список всех книг
         */
        function findAll() {

            $.ajax({
                type: 'GET',
                url: rootURL + '/catalog/all',
                dataType: "json",

                success: function (data) {
                    $(data).sort(function (a, b) {
                        return a.id - b.id
                    }).each(function (index, item) {
                        addBookAndSetUpControlButtons(item.id, item.name, item.author, item.date, item.open);
                    });

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('error: ' + textStatus);
                }

            });
        }

        $('#add_btn').bind('click', function (evt) {
            let dialog, form;

            dialog = $("#dialog_add_form").dialog({
                autoOpen: false,
                height: 700,
                width: 700,
                modal: true,
                buttons: [
                    {
                        text: "Сохранить",
                        click: function () {
                            let changedBookName = $('#' + this.id).find('#add_form_book_name').val();
                            let changedBookAuthor = $('#' + this.id).find('#add_form_book_author').val();
                            let changedCatalog = $('#add_form_book_catalog').prop('checked');
                            let changedDateRelease = $('#add_form_book_calendar').datepicker('getDate').getTime();

                            $.ajax({
                                type: 'POST',
                                url: rootURL + '/add/' + changedBookName + '/' + changedBookAuthor +
                                '/' + changedCatalog + '/' + changedDateRelease,
                                dataType: "json",
                                success: function (bookId) {
                                    addBookAndSetUpControlButtons(bookId, changedBookName, changedBookAuthor,
                                        changedDateRelease, changedCatalog);

                                    $("#dialog_add_form").dialog("close");
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    alert('error: ' + textStatus);
                                }
                            });
                        }
                    },
                    {
                        text: "Отмена",
                        click: function () {
                            $("#dialog-form").dialog("close");
                        }
                    }],
                close: function () {
                    form[0].reset();
                }
            });

            form = dialog.find("form").on("submit", function (event) {
                event.preventDefault();
            });

            dialog.find('#add_form_book_calendar').datepicker({//календарь
                dateFormat: 'dd/mm/yy'
            });

            dialog.dialog("option", "position", {my: "center top+10", at: "center top+10", of: window});

            dialog.dialog("open");
            dialog.show();
        });

        /**
         * Добавляем книгу на страницу и иницилизируем кнопки редактирования и удаления
         *
         * @param bookId номер книги
         * @param bookName название книги
         * @param bookAuthor автор книги
         * @param bookDateRelease дата выпуска книги
         * @param bookIsInOpenCatalog в каком каталоге находится книга(открытый - true, закрытый - false)
         */
        function addBookAndSetUpControlButtons(bookId, bookName, bookAuthor, bookDateRelease, bookIsInOpenCatalog) {
            let book_list_info_selector = $("#book_list_info");
            book_list_info_selector.append('<ul style="padding-bottom: 25px">' +
                '<input id="book_id" type="hidden" value="' + bookId + '"/>' +
                '<input id="book_release_date_long" type="hidden" value="' + bookDateRelease + '"/>' +
                '<input id="book_catalog_is_open" type="hidden" value="' + bookIsInOpenCatalog + '"/>' +
                '<li><div style="display:inline-flex">' +
                '<div><p>Название:&nbsp;</p></div><div><p id="book_name">' + bookName + '</p></div>' +
                '</li></div>' +
                '<li><div style="display:inline-flex">' +
                '<div><p>Автор:&nbsp;</p></div><div><p id="book_author">' + bookAuthor + '</p></div>' +
                '</li></div>' +
                '<li><div style="display:inline-flex"><div>' +
                '<p>Каталог:&nbsp;</p></div><div><p id="book_catalog">' +
                (bookIsInOpenCatalog ? 'Открытый' : 'Закрытый') + '</p></div>' +
                '</div></li>' +
                '<li><div style="display:inline-flex"><div>' +
                '<p>Дата выпуска:&nbsp;</p></div><p id="book_release_date">' +
                $.datepicker.formatDate('dd/mm/yy', new Date(bookDateRelease)) + '</p>' +
                '</div></li>' +
                '<input id="edit_btn" type="button" value="Редактировать"/>' +
                '<input id="delete_btn" type="button" value="Удалить"/>' +
                '</ul>' +
                '<hr>'
            );

            book_list_info_selector.find('ul #edit_btn').last().bind('click', function (evt) {
                let selected_block = $(evt.target).closest('ul');
                let dialog, form;

                dialog = $("#dialog_edit_form").dialog({
                    autoOpen: false,
                    height: 700,
                    width: 700,
                    modal: true,
                    buttons: [
                        {
                            text: "Сохранить",
                            click: function () {
                                let selectedBookId = selected_block.find('#book_id').val();
                                let changedBookName = $('#' + this.id).find('#edit_form_book_name').val();
                                let changedBookAuthor = $('#' + this.id).find('#edit_form_book_author').val();
                                let changedCatalog = $('#edit_form_book_catalog').prop('checked');
                                let changedDateRelease = $('#edit_form_book_calendar').datepicker('getDate').getTime();

                                editBook(selectedBookId, changedBookName, changedBookAuthor,
                                    changedDateRelease, changedCatalog);
                                $("#dialog_edit_form").dialog("close");
                            }
                        },
                        {
                            text: "Отмена",
                            click: function () {
                                $("#dialog_edit_form").dialog("close");
                            }
                        }],
                    close: function () {
                        form[0].reset();
                    }
                });

                form = dialog.find("form").on("submit", function (event) {
                    event.preventDefault();
                });

                dialog.find('#edit_form_book_name').val(selected_block.find('#book_name').html());
                dialog.find('#edit_form_book_author').val(selected_block.find('#book_author').html());
                dialog.find('#edit_form_book_catalog').prop('checked',
                    selected_block.find('#book_catalog_is_open').val() == 'true' ? true : false);

                dialog.find('#edit_form_book_calendar').datepicker({//календарь
                    defaultDate: $('#book_release_date').html(),
                    dateFormat: 'dd/mm/yy'
                });

                dialog.dialog("option", "position", {my: "center top+10", at: "center top+10", of: window});

                dialog.dialog("open");
                dialog.show();

            });

            book_list_info_selector.find('ul #delete_btn').last().bind('click', function (evt) {
                let selected_book_id = $(evt.target).closest('ul').find('#book_id').val();
                deleteBookById(selected_book_id);
            });

            /**
             * Запрос на редактирования книги
             *
             * @param bookId номер книги
             * @param bookName новое название книги
             * @param bookAuthor новый автор книги
             * @param bookReleaseDate новая дата выпуска книги
             * @param bookIsInOpenCatalog в какой каталог переместить книгу(открытый - true, закрытый - false)
             */
            function editBook(bookId, bookName, bookAuthor, bookReleaseDate, bookIsInOpenCatalog) {
                $.ajax({
                    type: 'POST',
                    url: rootURL + '/edit/' + bookId + '/' + bookName + '/' + bookAuthor +
                    '/' + bookIsInOpenCatalog + '/' + bookReleaseDate,
                    dataType: "json",
                    success: function () {
                        $("#book_list_info ul").each(function (index, item) {
                            if ($(item).find('#book_id').val() == bookId) {
                                $(item).find('#book_release_date_long').val(bookReleaseDate);
                                $(item).find('#book_catalog_is_open').val(bookIsInOpenCatalog);
                                $(item).find('#book_name').html(bookName);
                                $(item).find('#book_author').html(bookAuthor);
                                $(item).find('#book_catalog').html(bookIsInOpenCatalog ? 'Открытый' : 'Закрытый');
                                $(item).find('#book_release_date')
                                    .html($.datepicker.formatDate('dd/mm/yy', new Date(bookReleaseDate)));
                                return;
                            }
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('error: ' + textStatus);
                    }
                });
            };

            /**
             * Удаление книги из каталога
             *
             * @param bookId номер книги
             */
            function deleteBookById(bookId) {
                $.ajax({
                    type: 'POST',
                    url: rootURL + '/delete/' + bookId,
                    dataType: "json",
                    success: function () {
                        $("#book_list_info ul").each(function (index, item) {
                            if ($(item).find('#book_id').val() == bookId) {
                                $(item).remove();
                                return;
                            }
                        })
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('error: ' + textStatus);
                    }
                });
            };
        }
    }
);