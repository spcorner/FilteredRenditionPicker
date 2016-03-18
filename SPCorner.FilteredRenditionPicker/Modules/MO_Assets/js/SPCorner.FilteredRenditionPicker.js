// Inject style so we don't need to reference a CSS file just for this
// Ideally this would go into an existing custom CSS file
(function () {
    document.write("<style>" +
        "form[action*='ManageImageRenditions\.aspx'] table#renditions tr[id^='rendition999'], " +
        "form[action*='ManageImageRenditions\.aspx'] table#renditions tr[id^='rendition999'] + tr > td.ms-formline " +
            "{ display:none; }" +
        "</style>");
})();

SPCorner = window.SPCorner || {};
SPCorner.FilteredRenditionPicker = SPCorner.FilteredRenditionPicker || {};
SPCorner.FilteredRenditionPicker.InitRenditionsMenu = function (command, commandName, properties) {
    var MENU_ID = "Ribbon.Image.Image.Renditions.PickRenditionFiltered.Menu";

    //This 'empty' structure is expected by the Ribbon framework
    var jsonMenu = {
        name: "Menu",
        attrs: { Id: MENU_ID },
        children: []
    };

    if (RTE.Externals.imageRenditions && RTE.Externals.imageRenditions.Renditions.length > 0) {
        var renditionItems = RTE.Externals.imageRenditions.Renditions.map(function (rteRendition) {
            return {
                name: "Button",
                attrs: {
                    id: MENU_ID + ".Rendition.Item" + rteRendition.Id.toString(),
                    LabelText: SP.Utilities.HttpUtility.escapeXmlText(rteRendition.Name),
                    CommandType: "General",
                    MenuItemId: "Rendition" + rteRendition.Id.toString(),
                    CommandValueId: rteRendition.Id.toString(),
                    Command: RTE.PublishingCommandNames.pickImageRenditionClick
                }
            };
        }).filter(function (renditionObject) {
            return !/^Rendition999/.exec(renditionObject.attrs.MenuItemId);

            //Other criteria e.g. hide renditions with an _ prefix
            //return (renditionObject.attrs.LabelText || "").indexOf("_") != 0;
        });

        var renditionItemsSection = {
            name: "MenuSection",
            attrs: { Id: MENU_ID + ".Renditions" },
            children: [{
                name: "Controls",
                attrs: { Id: MENU_ID + ".Renditions.Controls" },
                children: renditionItems
            }]
        }
        jsonMenu.children.push(renditionItemsSection);

        var editRenditionsSection = {
            name: "MenuSection",
            attrs: { Id: MENU_ID + ".EditRenditions" },
            children: [{
                name: "Controls",
                attrs: { Id: MENU_ID + ".EditRenditions.Controls" },
                children: [{
                    name: "Button",
                    attrs: {
                        id: MENU_ID + ".EditRendition.Edit",
                        LabelText: SP.Utilities.HttpUtility.escapeXmlText(SP.Publishing.Resources.editImageRenditions),
                        CommandType: "General",
                        MenuItemId: "EditRendition",
                        Command: RTE.PublishingCommandNames.editImageRenditionClick
                    }
                }]
            }]
        };
        jsonMenu.children.push(editRenditionsSection);
    }

    //'Exit parameter' to be used by the Ribbon to populate the flyout
    properties.PopulationJSON = jsonMenu;
    
    //The return value doesn't really matter
    return true;
}

