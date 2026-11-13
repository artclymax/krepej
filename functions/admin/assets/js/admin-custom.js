/**
 * Скрипты кастомной админ-панели Verda
 */

(function($) {
    'use strict';
    
    // ===== Поиск по заявкам =====
    let searchTimeout = null;
    
    $('#verda-leads-search').on('input', function() {
        const query = $(this).val().trim();
        
        // Очищаем предыдущий таймер
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Показываем спиннер
        $('.verda-search-spinner').show();
        
        // Debounce поиска (300ms)
        searchTimeout = setTimeout(function() {
            searchLeads(query);
        }, 300);
    });
    
    function searchLeads(query) {
        $.ajax({
            url: verdaAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'verda_search_leads',
                search: query,
                nonce: verdaAdmin.nonce
            },
            success: function(response) {
                if (response.success && response.data.leads) {
                    renderLeads(response.data.leads);
                } else {
                    showNoResults();
                }
            },
            error: function() {
                showError();
            },
            complete: function() {
                $('.verda-search-spinner').hide();
            }
        });
    }
    
    function renderLeads(leads) {
        const tbody = $('#verda-leads-tbody');
        tbody.empty();
        
        if (leads.length === 0) {
            showNoResults();
            return;
        }
        
        leads.forEach(function(lead) {
            const row = `
                <tr>
                    <td>
                        <a href="${lead.edit_url}">
                            ${lead.date}
                        </a>
                    </td>
                    <td>
                        <a href="${lead.edit_url}">
                            ${lead.title}
                        </a>
                    </td>
                    <td>${lead.email}</td>
                    <td>${lead.phone}</td>
                    <td>${lead.form}</td>
                    <td class="verda-table-actions">
                        <a class="button button-small" href="${lead.edit_url}">
                            Открыть
                        </a>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }
    
    function showNoResults() {
        const tbody = $('#verda-leads-tbody');
        tbody.html(`
            <tr>
                <td colspan="6" style="text-align:center; padding:40px; color:#646970;">
                    ${verdaAdmin.strings.noResults}
                </td>
            </tr>
        `);
    }
    
    function showError() {
        const tbody = $('#verda-leads-tbody');
        tbody.html(`
            <tr>
                <td colspan="6" style="text-align:center; padding:40px; color:#d63638;">
                    ${verdaAdmin.strings.error}
                </td>
            </tr>
        `);
    }
    
    // ===== Уведомления о новых заявках =====
    let newLeadsCount = 0;
    let checkInterval = null;
    
    // Проверяем новые заявки каждые 30 секунд
    function startLeadsChecker() {
        checkNewLeads();
        checkInterval = setInterval(checkNewLeads, 30000);
    }
    
    function checkNewLeads() {
        $.ajax({
            url: verdaAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'verda_check_new_leads',
                nonce: verdaAdmin.nonce
            },
            success: function(response) {
                if (response.success && response.data.count > 0) {
                    newLeadsCount = response.data.count;
                    showNewLeadsNotice(newLeadsCount);
                }
            }
        });
    }
    
    function showNewLeadsNotice(count) {
        const notice = $('#verda-new-leads-notice');
        const countSpan = $('#verda-new-leads-count');
        
        countSpan.text(count);
        notice.slideDown(300);
    }
    
    // Функция обновления заявок (вызывается из кнопки в уведомлении)
    window.verdaRefreshLeads = function() {
        // Скрываем уведомление
        $('#verda-new-leads-notice').slideUp(300);

        // Перезагружаем страницу
        location.reload();
    };

    // Функция очистки кеша заявок
    window.verdaClearLeadsCache = function() {
        $.ajax({
            url: verdaAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'verda_clear_leads_cache',
                nonce: verdaAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    // Перезагружаем страницу для обновления таблицы
                    location.reload();
                } else {
                    alert('Ошибка при очистке кеша');
                }
            },
            error: function() {
                alert('Ошибка соединения');
            }
        });
    };
    
    // ===== Загрузчик изображений (логотип, иконка) =====
    function initImageUploader(btnSelector, inputSelector, previewSelector) {
        $(document).on('click', btnSelector, function(e) {
            e.preventDefault();
            
            const frame = wp.media({
                title: 'Выбор изображения',
                button: {
                    text: 'Выбрать'
                },
                multiple: false
            });
            
            frame.on('select', function() {
                const attachment = frame.state().get('selection').first().toJSON();
                $(inputSelector).val(attachment.id);
                $(previewSelector).attr('src', attachment.url);
            });
            
            frame.open();
        });
    }
    
    // Инициализация загрузчиков
    $(document).ready(function() {
        initImageUploader('.upload-logo', '#custom_logo', '#logo-preview');
        initImageUploader('.upload-icon', '#site_icon', '#icon-preview');
        
        // Удаление логотипа
        $(document).on('click', '.remove-logo', function(e) {
            e.preventDefault();
            $('#custom_logo').val('');
            $('#logo-preview').attr('src', '');
        });
        
        // Запускаем проверку новых заявок только на вкладке "Заявки"
        if ($('#verda-leads-search').length > 0) {
            startLeadsChecker();
        }
    });
    
    // ===== Автоматическое скрытие уведомлений WordPress =====
    setTimeout(function() {
        $('.notice.is-dismissible').fadeOut(500);
    }, 5000);
    
})(jQuery);
